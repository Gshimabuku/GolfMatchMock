/**
 * ビジネスツール共通Ajax js
 */

/**
 * Ajax通信
 *
 * @param url       : APIのURL
 * @param params    : postするデータ
 * @param callback  : コールバックメソッド
 *
 * @return なし
 */
function eibtAjaxGet(url, params, callback) {
	eibtAjax('GET', url, params, callback);
}
function eibtAjaxPost(url, params, callback) {
	eibtAjax('POST', url, params, callback);
}
function eibtAjax(ajaxType, url, params, callback) {

	eibtLoadingShow();
	$.ajax({
		type: ajaxType,
		dataType: "json",
		url: url,
		data: params,
		cache: false,
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	})
	.done(function (result) {
		eibtAjaxCallbackSuccess(result, callback);
	})
	.fail(function (result, textStatus, errorThrown) {
		eibtAjaxCallbackError(result, textStatus, errorThrown, callback);
	})
	.always(function (result) {
		eibtLoadingClose();
	});
}
function eibtAjaxForm(url, formData, callback) {
	eibtLoadingShow();
	$.ajax({
		type: 'post',
		dataType: "json",
		url: url,
		data: formData,
		cache: false,
		processData:false,
		contentType:false,
		enctype:'multipart/form-data',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	})
	.done(function (result) {
		eibtAjaxCallbackSuccess(result, callback);
	})
	.fail(function (result, textStatus, errorThrown) {
		eibtAjaxCallbackError(result, textStatus, errorThrown, callback);
	})
	.always(function (result) {
		eibtLoadingClose();
	});
}

/**
 * 通信の正常終了処理
 *
 * @param result    : APIからの返却値
 * @param callback  : コールバックメソッド
 *
 * @return なし
 */
var eibtAjaxCallbackSuccess = function (result, callback) {

	// callback指定なしの場合、返却値返せないので処理終了
	if ('function' != typeof callback) {
		return;
	}
	// APIからの返却値がない場合エラー
	if (eibtIsEmpty(result)) {
		ret = {
			status: '999',
			message: 'Failed to connect to server.'
		};
		callback(ret);
		return;
	}
	//  Json形式に成形
	let ret = {};
	if (typeof result == 'string') {
		ret = JSON.parse(result);
	} else {
		ret = result;
	}
	// EIBTのAPIからの返却形式ではない場合エラー
	if (typeof ret.status === 'undefined') {
		ret = {
			status: '999',
			message: 'Failed to connect to server.'
		};
		callback(ret);
		return;
	}
	callback(ret);
}

/**
 * 通信の異常終了処理
 *
 * @param result       : APIからの返却値
 * @param textStatus   : Ajaxのステータス
 * @param errorThrown  : 例外情報
 * @param callback     : コールバックメソッド
 *
 * @return なし
 */
var eibtAjaxCallbackError = function (result, textStatus, errorThrown, callback) {

	console.log(result);
	console.log(textStatus);
	console.log(errorThrown);
	if ('function' != typeof callback) {
		return;
	}
	if (textStatus == 'timeout') {
		ret = {
			status: '999',
			message: 'timeout It happened.',
		};
		callback(ret);
		return;
	}
	// APIからの返却値がない場合エラー
	if (eibtIsEmpty(result.responseJSON)) {
		ret = {
			status: '999',
			message: 'Failed to connect to server.'
		};
		callback(ret);
		return;
	}
	ret = {
		status: result.responseJSON.status,
		message: result.responseJSON.message
	};
	callback(ret);
	return;
}
