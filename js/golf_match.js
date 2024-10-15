/**
 * ビジネスツール共通js
 */
/**
 * 要素はあるか？
 *
 * @param val : 判断対象
 *
 * @returns true=なし、false=あり
 */
function eibtIsEmpty(val) {
    if (typeof val === 'undefined' || val === null || val.length <= 0) {
        return true;
    }
    return false;
}
function eibtIsNotEmpty(val) {
    return !eibtIsEmpty(val);
}

/**
 * 金額チェック
 *   App\Consts\EibtValidationRuleConst::FEE と同じ内容でチェックする
 *
 * @param val : 金額
 * @returns true=正常値、false=異常値
 */
function eibtCheckFee(val) {
    if (eibtIsEmpty(val)) {
        return false;
    }
    if (!$.isNumeric(val)) {
        return false;
    }
    let num = Number(val);
    if (num < 1) {
        return false;
    }
    if (num > 9999.99) {
        return false;
    }
    return true;
}

/**
 * 日付比較
 *
 * @param date1     比較対象の日付（例：2024/07/01）
 * @param date2     比較対象の日付（例：2024/07/30）
 * @param delimiter 区切り文字（上記の例だと / スラッシュ）
 *
 * @return -1=data1が小さい, 0=等しい, 1=data1が大きい
 */
function eibtDateCompare(date1, date2, delimiter) {
    var parts1 = date1.split(delimiter);
    var parts2 = date2.split(delimiter);
    var d1 = new Date(parseInt(parts1[0]), parseInt(parts1[1]) - 1, parseInt(parts1[2]));
    var d2 = new Date(parseInt(parts2[0]), parseInt(parts2[1]) - 1, parseInt(parts2[2]));
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
}

/**
 * 文字列置換
 *
 * @param val  : 対象文字列
 * @param sOld : 置換検索文字
 * @param sNew : 置換文字
 *
 * @returns 置換実行後の文字列
 */
function eibtReplace(val, sOld, sNew) {
    if (eibtIsEmpty(val)) {
        return val;
    }
    if (eibtIsEmpty(sOld)) {
        return val;
    }
    if (eibtIsEmpty(sNew)) {
        sNew = '';
    }
    return val.replace(sOld, sNew);
}

/**
 * Jqueryのセレクター用のエスケープ
 *
 * @param {*} val
 * @returns
 */
function selectorEscape(val) {
    return val.replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');
}

/**
 * 画面TOPにスクロール
 */
function eibtScrollToTop() {
    $('html').animate({ scrollTop: 0 }, 'fast');
}

/**
 * ローディングの表示・非表示
 */
function eibtLoadingShow() {
    let html
        = '<div class="eibt-loading" id="eibt-loading">'
        + '<div class="loader"></div>'
        + '</div>';
    $('body').append(html);
}
function eibtLoadingClose() {
    setTimeout(function () {
        $('#eibt-loading').remove();
    }, 250);
}

/**
 * モーダルの表示・非表示
 */
function eibtModalShow(selector) {
    $(selector).fadeIn();
    $('body').addClass('eibt-body-modal');
}
function eibtModalClose(selector) {
    $(selector).fadeOut();
    $('body').removeClass('eibt-body-modal');
}

/**
 * ファイルのダウンロード実行
 *   APIで取得したbase64データを実ファイルにしてブラウザでダウンロード実行する
 *
 * @param fileInfo  : ダウンロードするファイル情報（App\Dto\Eibt\EibtFileInfoDto）
 */
function eibtDownloadFile(fileInfo) {

    //------------------------------------------------------------------------------------------
    // ダウンロード準備
    //------------------------------------------------------------------------------------------
    // Base64データをBlobに変換
    let binary = atob(fileInfo.fileData);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    let blob = new Blob([new Uint8Array(array)], { type: fileInfo.fileType });

    // ダウンロード用のURLを作成
    let url = window.URL.createObjectURL(blob);

    //------------------------------------------------------------------------------------------
    // 自動的にダウンロードが開始されるようにする（tmpリンクを作成しクリックイベントを発火）
    //------------------------------------------------------------------------------------------
    // tmpリンク作成
    var a = $('<a style="display: none;"></a>');
    a.attr('href', url);
    a.attr('download', fileInfo.fileName);
    $('body').append(a);
    // クリックイベント発火
    a[0].click();
    // tmpリンク削除
    // #15879 iPad(safari)でエラーとなるので削除のタイミングをずらす
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
    }, 200);
}

/**
 * 読み取り専用にする
 *
 * @param selector 指定したセレクター配下の入力項目要素に disabled をセットする
 */
function eibtReadOnly(selector) {
    $(selector).find('input[type="text"]').prop('disabled', true);
    $(selector).find('input[type="date"]').prop('disabled', true);
    $(selector).find('input[type="radio"]').prop('disabled', true);
    $(selector).find('input[type="checkbox"]').prop('disabled', true);
    $(selector).find('select').prop('disabled', true);
    $(selector).find('textarea').prop('disabled', true);
    // 言語毎の記事・コンテンツの切替はイキにする
    $('.eibt-lang-list').find('input[type="radio"]').prop('disabled', false);
}

/**
 * 全角英数字->半角英数字変換全角を半角にする
 *
 * @param str 対象文字
 */
function eibtConvZenkakuToHankaku(str) {
    // 全角を半角へ変換(英数字記号)
    return str.replace(/[！-～]/g, (s) => { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); });
}

/**
 * 金額切り捨て
 *   小数２桁で切り捨て
 *
 * @param value 対象の値
 */
function eibtFloorFee(value) {
    let num = Number(value);
    // 小数２桁で切り捨て
    return Math.floor(num * 100) / 100;
}

/**
 * 金額フォーマット
 *   先頭に"$"付きのカンマ区切り文字列を返却
 *
 * @param value 対象の値
 */
function eibtFormatFee(value) {
    let fee = eibtFloorFee(value);
    return '$' + fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * ユーザーエージェントの取得
 *
 * @return 以下のEIBT内部変数で返す
 */
var EIBT_UA_OTHERS = 999;
var EIBT_UA_IPAD = 1;
var EIBT_UA_IPHONE = 2;
var EIBT_UA_ANDRIOD = 3;
var EIBT_UA_MSIE = 4;
var EIBT_UA_EDGE = 5;
var EIBT_UA_CHROME = 6;
var EIBT_UA_SAFARI = 7;
var EIBT_UA_FIREFOX = 8;
var EIBT_UA_OPERA = 9;
function eibtGetUserAgent() {
    let userAgent = navigator.userAgent.toLowerCase();
    if (/ipad/.test(userAgent)) {
        return EIBT_UA_IPAD;
    } else if (/iphone/.test(userAgent)) {
        return EIBT_UA_IPHONE;
    } else if (/android/.test(userAgent)) {
        return EIBT_UA_ANDRIOD;
    } else if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
        return EIBT_UA_MSIE;
    } else if (userAgent.indexOf('edge') !== -1) {
        return EIBT_UA_EDGE;
    } else if (userAgent.indexOf('chrome') !== -1) {
        return EIBT_UA_CHROME;
    } else if (userAgent.indexOf('safari') !== -1) {
        return EIBT_UA_SAFARI;
    } else if (userAgent.indexOf('firefox') !== -1) {
        return EIBT_UA_FIREFOX;
    } else if (userAgent.indexOf('opera') !== -1 || userAgent.indexOf('opr') !== -1) {
        return EIBT_UA_OPERA;
    }
    return EIBT_UA_OTHERS;
}

/**
 * #15950 PDF表示可能か？（embedタグを利用して表示可能か？）
 *   ユーザーエージェントで判断する
 * @return true=表示可能、false=表示不可
 */
function eibtIsDisplayPDF() {
    let userAgent = eibtGetUserAgent();
    if (
        userAgent == EIBT_UA_OTHERS ||
        userAgent == EIBT_UA_IPAD ||
        userAgent == EIBT_UA_IPHONE ||
        userAgent == EIBT_UA_SAFARI
    ) {
        return false;
    }
    return true;
}

/**
 * #16036 画面遷移
 * @param {*} url 
 */
function eibtMovePage(url) {
    window.location = url;
    eibtLoadingShow();
}

/**
 * ##################################################################################################
 * イベント
 * ##################################################################################################
 */
$(function () {

    /**
     * 画面遷移時にローディングを表示
     * #16036 beforeunload は ipad（safari）でイベントハンドリングできない為の代替
     */
    var isEibtLoadingShowMovePage = false;
    $(document).on('click', '*', function(event) {
        if (isEibtLoadingShowMovePage) {
            return;
        }
        $target = $(this);
        
        // aタグでURLが指定されている
        $TagA = null;
        if ($target.is('a')) {
            $TagA = $target;
        } else {
            $TagA = $target.closest('a');
        }
        if (eibtIsNotEmpty($TagA)) {
            let propDownload = $TagA.attr('download');
            if (eibtIsNotEmpty(propDownload)) {
                return; // ダウンロードは除外
            }
            let propHref = $TagA.attr('href');
            if (eibtIsEmpty(propHref)) {
                return;
            }
            if (propHref == '#' || propHref == 'javascript:void(0)') {
                return;
            }
            let propTarget = $TagA.attr('target');
            if (eibtIsNotEmpty(propTarget) && propTarget == '_blank') {
                return;
            }
            isEibtLoadingShowMovePage = true;
            eibtLoadingShow();

            return;
        }
        // onclickイベントで画面遷移
        let funcOnclick = $target.attr('onclick');
        if (eibtIsNotEmpty(funcOnclick)) {
            if (funcOnclick.includes('window.location')) {
                isEibtLoadingShowMovePage = true;
                eibtLoadingShow();
            }
            return;
        }
    });
    // submit時にloading表示（#16036関連）
    $(document).on('submit', function(event) {
        isEibtLoadingShowMovePage = true;
        eibtLoadingShow();
    });

    // ブラウザバックで戻ってきたときにloadingを消す
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            isEibtLoadingShowMovePage = false;
            eibtLoadingClose();
        }
    });

    /**
     * テキストボックスでEnterキー押下でSubmit（Reload）させないようにする
     *   "allow_submit"クラスは除く
     */
    $(document).on("keypress", "input:not(.allow_submit)", function (event) {
        return event.which !== 13;
    });

    /**
     * 金額フィールドのchangeイベント
     */
    $('.eibt-fee').on('change', function () {
        // 全角を半角へ変換
        $(this).val(eibtConvZenkakuToHankaku($(this).val()));
    });

    /** カードのメニュー表示 */
    $(document).on('click', '.eibt-card-menu-btn', function(event) {
        event.stopPropagation();
        $('.eibt-card-menu').hide(); // 他で表示中の物があればそれは消す
        $(this).find('.eibt-card-menu').fadeIn();
    });
    /** メニュー外をクリックした場合、メニューを非表示にする */
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.eibt-card-menu').length) {
            $('.eibt-card-menu').hide();
        }
    });

    /**
     * 年月日フィールドのdefaultValueをクリアする
     *   [iPad対応]リセットでクリアさせる為
     */
    $('input[type=date]').each(function (index, element) {
        // 退避
        value = $(this).val();
        // defalutValueをクリア
        $(this).prop('defaultValue', '');
        // 退避した値をvalueへ戻す
        $(this).val(value);
    });
});
