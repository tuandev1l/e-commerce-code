(function () {
  var traffic_key = 'traffic_pgEZt';
  var traffic_id = '553621e73a8604ca26d538a6704b7da7';
  var traffic_domain = 's1.what-on.com';
  var traffic_session = '67834766c427db57632c3f04';
  var uuid_name = 'traffic_pgEZt';
  var check_script_hash = '#check_script';

  var initTrafficScript = initTrafficScript || {};
  var traffic_wait_time = 70;
  var traffic_click = false;
  var traffic_blurred = !1;
  var hidden = 'hidden';

  var check_ref = false;
  var get_code = true;

  var get_code_string = 'LẤY MÃ';
  var get_code_after_string = 'Lấy mã sau';
  var code_string = 'Mã KM';
  var copied_notify = 'Đã sao chép mã';
  var close_private_mode_message =
    'Vui lòng tắt chế độ Ẩn danh để tiếp tục. Xin cảm ơn.';
  var jscd = {};
  var loaded_script = false;

  if (hidden in document)
    document.addEventListener('visibilitychange', onchange);
  else if ((hidden = 'mozHidden') in document)
    document.addEventListener('mozvisibilitychange', onchange);
  else if ((hidden = 'webkitHidden') in document)
    document.addEventListener('webkitvisibilitychange', onchange);
  else if ((hidden = 'msHidden') in document)
    document.addEventListener('msvisibilitychange', onchange);
  // IE 9 and lower:
  else if ('onfocusin' in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow =
      window.onpagehide =
      window.onfocus =
      window.onblur =
        onchange;
  // Localize jQuery variable
  var jQuery;

  if (!isFirstLoad(initTrafficScript)) {
    return;
  }
  /******** Load jQuery if not present *********/
  if (
    window.jQuery === undefined ||
    window.jQuery.fn === undefined ||
    window.jQuery.fn.jquery !== '3.6.0'
  ) {
    var script_tag = document.createElement('script');
    script_tag.setAttribute('type', 'text/javascript');
    script_tag.setAttribute(
      'src',
      'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'
    );
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () {
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
          scriptTrafficLoadHandler();
        }
      };
    } else {
      script_tag.onload = scriptTrafficLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (
      document.getElementsByTagName('head')[0] || document.documentElement
    ).appendChild(script_tag);
  } else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    traffic_main();
  }

  /******** Called once jQuery has loaded ******/
  function scriptTrafficLoadHandler() {
    jQuery = window.jQuery.noConflict(true);
    traffic_main();
  }

  /******** Our traffic_main function ********/
  function traffic_main() {
    var initScript = function () {
      if (loaded_script) {
        return;
      }

      getClientInfo();

      /******* Load HTML *******/

      if (typeof Storage !== 'undefined') {
        var uuid = localStorage.getItem(uuid_name);
        if (uuid === null) {
          var uuid = generateUUID();
          localStorage.setItem(uuid_name, uuid);
        }
      } else {
        var uuid = generateUUID();
      }

      jscd.client_id = uuid;
      jscd.pathname = window.location.pathname;
      jscd.href = window.location.href;
      jscd.hostname = window.location.hostname;

      if (ref_domain_list.length) {
        for (var x in ref_domain_list) {
          // var replace = "^https?:\/\/" + ref_domain_list[x] + "(\/|\.|$)";
          var replace = '^https?://([^/]+.)?' + ref_domain_list[x] + '(/|.|$)';
          var re = new RegExp(replace, 'i');

          if (document.referrer.match(re)) {
            check_ref = true;
            break;
          }
        }
      } else if (
        document.referrer == '' ||
        document.referrer == location.href
      ) {
        check_ref = true;
      }

      if (checkAdsClick()) {
        return false;
      }
      forceShowButton();

      var element = document.getElementById(traffic_key);
      if (element && check_ref && get_code) {
        loaded_script = true;
        // element.style.background = '#fff';
        element.style.padding = '5px';
        element.style.color = '#000';
        element.style.position = 'relative';
        element.style.clear = 'both';

        var button = document.createElement('span');
        button.innerHTML =
          '<img alt="' +
          window.location.hostname +
          '"  src = "https://' +
          traffic_domain +
          '/images/icons/icon-x64.png" height="" style="padding:0;vertical-align:middle;padding-right:5px !important;width:auto !important;height:15px !important;display:inline-block !important;margin: 0!important;border: none!important;border-radius: unset!important;float: unset!important;background:none !important;"/> <span style="display:inline-block;vertical-align:middle;color:#fff">' +
          get_code_string +
          '</span>';
        button.style.background = '#ed1c24';
        button.style.border = '1px solid #fff';
        button.style.color = '#fff';
        button.style.fontWeight = '700';
        button.style.fontSize = '14px';
        button.style.borderRadius = '7px';
        button.style.padding = '5px 10px';
        button.style.margin = '5px';
        button.style.minHeight = 'auto';
        button.style.minWidth = '130px';
        button.style.lineHeight = '20px';
        button.style.verticalAlign = 'middle';
        button.style.width = 'auto';
        button.style.cursor = 'pointer';
        button.style.display = 'inline-block';

        var show_code_button = document.createElement('div');
        show_code_button.innerHTML = '';
        show_code_button.style.background = '#ed1c24';
        show_code_button.style.border = '1px solid #fff';
        show_code_button.style.color = '#fff';
        show_code_button.style.fontWeight = '700';
        show_code_button.style.fontSize = '14px';
        show_code_button.style.borderRadius = '7px';
        show_code_button.style.padding = '5px 10px';
        show_code_button.style.margin = '5px';
        show_code_button.style.display = 'inline-block';
        show_code_button.style.minHeight = 'auto';
        show_code_button.style.minWidth = '130px';
        show_code_button.style.lineHeight = '20px';
        show_code_button.style.verticalAlign = 'middle';
        show_code_button.style.width = 'auto';

        element.appendChild(button);

        var n = 1e3 * traffic_wait_time;
        var clickHandler =
          'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

        button.addEventListener('mouseenter', (e) => {
          button.style.background = '#c40b11';
        });

        button.addEventListener('mouseleave', (e) => {
          button.style.background = '#ed1c24';
        });

        button.addEventListener('mousedown', (e) => {
          button.style.background = '#9a070d';
        });

        button.addEventListener('mouseup', (e) => {
          button.style.background = '#ed1c24';
        });

        button.addEventListener(clickHandler, function (event) {
          event.preventDefault();
          detectIncognito().then((result) => {
            if (result.isPrivate) {
              show_code_button.innerHTML = close_private_mode_message;
              element.innerHTML = '';
              element.appendChild(show_code_button);
            } else {
              show_code_button.innerHTML =
                get_code_after_string + ' ' + n / 1e3;
              element.innerHTML = '';
              element.appendChild(show_code_button);
              element.dataset.time = traffic_wait_time;
              element.dataset.click = 'true';

              // checkButtonClick();
              window.setTimeout(function () {
                var t;

                t = setInterval(function () {
                  traffic_blurred ||
                    ((n -= 1e3),
                    element.dataset.click == 'true' &&
                      ((show_code_button.innerHTML =
                        get_code_after_string + ' ' + n / 1e3),
                      (element.innerHTML = ''),
                      element.appendChild(show_code_button)),
                    (element.dataset.time = n / 1e3),
                    n <= 0 && (clearInterval(t), checkButtonClick()));
                }, 1e3);
              }, 100);
            }
          });

          return false;
        });
        // var n=1e3*traffic_wait_time
        // window.setTimeout(function(){
        // 	var t;

        // 	t=setInterval(function(){
        // 		traffic_blurred
        // 			||(n-=1e3,
        // 				(element.dataset.click=='true'&&(show_code_button.innerHTML='Lấy mã sau ' + n/1e3,element.innerHTML='',element.appendChild(show_code_button))),
        // 				element.dataset.time = n/1e3,
        // 				n<=0&&(clearInterval(t),checkButtonClick())
        // 			);
        // 	},1e3)
        // },100);
      }

      if (
        element &&
        window.location.hash &&
        window.location.hash == check_script_hash
      ) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;

        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
            }
          }
        };
        xmlhttp.addEventListener('loadend', function () {});
        xmlhttp.open(
          'GET',
          'https://' +
            traffic_domain +
            '/widget/get_code.html?confirm=1&code=' +
            traffic_id +
            '&traffic_session=' +
            traffic_session +
            '&' +
            jQuery.param(jscd),
          true
        );
        xmlhttp.send();
      }
    };
    window.onload = initScript;
    jQuery(document).ready(initScript);
  }
  function getClientInfo() {
    var unknown = '-';

    //	screen

    var screenSize = '';
    if (screen.width) {
      var width = screen.width ? screen.width : '';
      var height = screen.height ? screen.height : '';
      screenSize += '' + width + ' x ' + height;
    }

    //	browser

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    //	Opera

    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
      browser = 'Opera';
      version = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }

    //	Opera Next

    if ((verOffset = nAgt.indexOf('OPR')) != -1) {
      browser = 'Opera';
      version = nAgt.substring(verOffset + 4);
    }

    //	MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
      browser = 'Microsoft Internet Explorer';
      version = nAgt.substring(verOffset + 5);
    }

    //	Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
      browser = 'Chrome';
      version = nAgt.substring(verOffset + 7);
    }

    //	Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
      browser = 'Safari';
      version = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }

    //	Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
      browser = 'Firefox';
      version = nAgt.substring(verOffset + 8);
    }
    //	MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
      browser = 'Microsoft Internet Explorer';
      version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    //	Other browsers
    else if (
      (nameOffset = nAgt.lastIndexOf(' ') + 1) <
      (verOffset = nAgt.lastIndexOf('/'))
    ) {
      browser = nAgt.substring(nameOffset, verOffset);
      version = nAgt.substring(verOffset + 1);
      if (browser.toLowerCase() == browser.toUpperCase()) {
        browser = navigator.appName;
      }
    }
    //	trim the version string

    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
      version = '' + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    //	mobile version

    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    //	cookie

    var cookieEnabled = navigator.cookieEnabled ? true : false;

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled =
        document.cookie.indexOf('testcookie') != -1 ? true : false;
    }

    //	system

    var os = unknown;
    var clientStrings = [
      { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
      { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
      { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
      { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
      { s: 'Windows Vista', r: /Windows NT 6.0/ },
      { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
      { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
      { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
      { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
      { s: 'Windows 98', r: /(Windows 98|Win98)/ },
      { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
      { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
      { s: 'Windows CE', r: /Windows CE/ },
      { s: 'Windows 3.11', r: /Win16/ },
      { s: 'Android', r: /Android/ },
      { s: 'Open BSD', r: /OpenBSD/ },
      { s: 'Sun OS', r: /SunOS/ },
      { s: 'Linux', r: /(Linux|X11)/ },
      { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
      { s: 'Mac OS X', r: /Mac OS X/ },
      { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
      { s: 'QNX', r: /QNX/ },
      { s: 'UNIX', r: /UNIX/ },
      { s: 'BeOS', r: /BeOS/ },
      { s: 'OS/2', r: /OS\/2/ },
      {
        s: 'Search Bot',
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
      },
    ];
    for (var id in clientStrings) {
      var cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
      }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1];
      os = 'Windows';
    }

    switch (os) {
      case 'Mac OS X':
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
        break;

      case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
        break;

      case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
        osVersion =
          osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
        break;
    }

    //	flash (you'll need to include swfobject)
    /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
    var flashVersion = 'no check';
    if (typeof swfobject != 'undefined') {
      var fv = swfobject.getFlashPlayerVersion();
      if (fv.major > 0) {
        flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
      } else {
        flashVersion = unknown;
      }
    }

    jscd.screen = screenSize;
    jscd.browser = browser;
    jscd.browserVersion = version;
    jscd.browserMajorVersion = majorVersion;
    jscd.mobile = mobile;
    jscd.os = os;
    jscd.osVersion = osVersion;
    jscd.cookies = cookieEnabled;
    jscd.flashVersion = flashVersion;
    jscd.lang = navigator.language;
  }
  function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }
  function isFirstLoad(namesp) {
    var isFirst = namesp.firstLoad === undefined;
    namesp.firstLoad = false;
    return isFirst;
  }
  function checkButtonClick() {
    var element = document.getElementById(traffic_key);

    if (
      (element.dataset.loading == undefined ||
        element.dataset.loading == 'false') &&
      element.dataset.click == 'true' &&
      element.dataset.loaded == undefined &&
      element.dataset.time <= 0
    ) {
      var code = element.dataset.code;

      var xmlhttp = new XMLHttpRequest();
      xmlhttp.withCredentials = true;

      element.dataset.loading = 'true';

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          // XMLHttpRequest.DONE == 4
          if (xmlhttp.status == 200) {
            var result = JSON.parse(xmlhttp.responseText);
            if (result.success == true) {
              element.getElementsByTagName('div')[0].innerHTML =
                code_string +
                ': ' +
                result.html +
                '<img alt="' +
                window.location.hostname +
                '"  src="https://' +
                traffic_domain +
                '/images/icons/icon-copy.png" style="height: 14px !important;margin: -5px 0 0 3px !important;vertical-align: middle;display: inline-block;width:auto !important;">';
              element.addEventListener('click', function () {
                if (copyTextToClipboard(result.html)) {
                  var tooltip = createTooltip(copied_notify);
                  element.appendChild(tooltip);
                  window.setTimeout(function () {
                    tooltip.remove();
                  }, 3000);
                }
                return false;
              });
              window.removeEventListener('scroll', checkScroll, false);
              element.dataset.loaded = true;
            } else {
              element.remove();
            }
          } else {
            element.getElementsByTagName('div')[0].innerHTML =
              'Lỗi khi lấy mã. Bạn vui lòng thử lại.';
            setTimeout(function () {
              element.remove();
            }, 5000);
          }
        }
      };
      xmlhttp.onerror = function () {
        element.getElementsByTagName('div')[0].innerHTML =
          'Lỗi khi lấy mã. Bạn vui lòng thử lại.';
        setTimeout(function () {
          element.remove();
        }, 5000);
      };
      xmlhttp.addEventListener('loadend', function () {
        element.dataset.loading = 'false';
      });
      xmlhttp.open(
        'GET',
        'https://' +
          traffic_domain +
          '/widget/get_code.html?code=' +
          traffic_id +
          '&traffic_session=' +
          traffic_session +
          '&' +
          jQuery.param(jscd),
        true
      );
      xmlhttp.send();
    }
  }

  function checkScroll() {
    var element = document.getElementById(traffic_key);
    var rect = element.getBoundingClientRect();
    if (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      (element.dataset.loading == undefined ||
        element.dataset.loading == 'false') &&
      element.dataset.loaded == undefined &&
      element.dataset.time <= 0
    ) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.withCredentials = true;

      element.dataset.loading = 'true';

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          // XMLHttpRequest.DONE == 4
          if (xmlhttp.status == 200) {
            var result = JSON.parse(xmlhttp.responseText);
            if (result.success == true) {
              element.getElementsByTagName('div')[0].innerHTML =
                code_string + ': ' + result.html;
              window.removeEventListener('scroll', checkScroll, false);
              element.dataset.loaded = true;
            } else {
              element.remove();
            }
          }
        }
      };
      xmlhttp.addEventListener('loadend', function () {
        element.dataset.loading = 'false';
      });
      xmlhttp.open(
        'GET',
        'https://' +
          traffic_domain +
          '/widget/get_code.html?code=' +
          traffic_id +
          '&traffic_session=' +
          traffic_session +
          '&' +
          jQuery.param(jscd),
        true
      );
      xmlhttp.send();
    }
  }
  function onchange(evt) {
    var v = 'visible',
      h = 'hidden',
      evtMap = {
        focus: v,
        focusin: v,
        pageshow: v,
        blur: h,
        focusout: h,
        pagehide: h,
      };
    evt = evt || window.event;
    if (evt.type in evtMap) traffic_blurred = evtMap[evt.type] == 'hidden';
    else traffic_blurred = this[hidden] ? 1 : 0;
  }
  function copyTextToClipboard(text) {
    var textArea = document.createElement('textarea');

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    textArea.style.width = '2em';
    textArea.style.height = '2em';

    textArea.style.padding = 0;

    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);

    textArea.select();

    var successful = false;
    try {
      var tmp = document.oncopy;
      document.oncopy = function () {};
      successful = document.execCommand('copy');
      document.oncopy = tmp;
    } catch (err) {}
    document.body.removeChild(textArea);
    return successful;
  }

  function createTooltip(text) {
    var tooltip = document.createElement('div');
    tooltip.style.top = '-7px';
    tooltip.style.left = '50%';
    tooltip.style.display = 'block';
    tooltip.style.transform = 'translate(-50%,-50%)';
    tooltip.style.padding = '5px 0';
    tooltip.style.opacity = '0.9';
    tooltip.style.position = 'absolute';

    var arrow = document.createElement('div');
    arrow.style.left = '50%';
    arrow.style.bottom = '0';
    arrow.style.marginLeft = '-5px';
    arrow.style.borderWidth = '5px 5px 0';
    arrow.style.position = 'absolute';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderColor = 'transparent';
    arrow.style.borderStyle = 'solid';
    arrow.style.borderTopColor = '#000';

    var inner = document.createElement('div');
    inner.style.padding = '3px 8px';
    inner.style.color = '#fff';
    inner.style.textAlign = 'center';
    inner.style.backgroundColor = '#000';
    inner.style.borderRadius = '4px';
    inner.innerHTML = text;

    tooltip.appendChild(arrow);
    tooltip.appendChild(inner);

    return tooltip;
  }
  function checkAdsClick() {
    var ads_click = false;
    var url_string = window.location.href;
    var url = new URL(url_string);

    if (url.searchParams.get('gclid') != null) {
      ads_click = true;
    }
    return ads_click;
  }
  function forceShowButton() {
    if (window.location.hash != '') {
      var hash = window.location.hash.split('-');
      if (hash[0] == '#ss') {
        check_ref = false;
        if (hash[1] == traffic_key) {
          check_ref = true;
          return true;
        }
      }
    }
    return false;
  }
  var detectIncognito = function () {
    return new Promise(function (resolve, reject) {
      var browserName = 'Unknown';
      function __callback(isPrivate) {
        resolve({
          isPrivate: isPrivate,
          browserName: browserName,
        });
      }
      function identifyChromium() {
        var ua = navigator.userAgent;
        if (ua.match(/Chrome/)) {
          if (navigator.brave !== undefined) {
            return 'Brave';
          } else if (ua.match(/Edg/)) {
            return 'Edge';
          } else if (ua.match(/OPR/)) {
            return 'Opera';
          }
          return 'Chrome';
        } else {
          return 'Chromium';
        }
      }
      function assertEvalToString(value) {
        return value === eval.toString().length;
      }
      function isSafari() {
        var v = navigator.vendor;
        return (
          v !== undefined && v.indexOf('Apple') === 0 && assertEvalToString(37)
        );
      }
      function isChrome() {
        var v = navigator.vendor;
        return (
          v !== undefined && v.indexOf('Google') === 0 && assertEvalToString(33)
        );
      }
      function isFirefox() {
        return (
          document.documentElement !== undefined &&
          document.documentElement.style.MozAppearance !== undefined &&
          assertEvalToString(37)
        );
      }
      function isMSIE() {
        return navigator.msSaveBlob !== undefined && assertEvalToString(39);
      }
      /**
       * Safari (Safari for iOS & macOS)
       **/
      function newSafariTest() {
        var tmp_name = String(Math.random());
        try {
          var db = window.indexedDB.open(tmp_name, 1);
          db.onupgradeneeded = function (i) {
            var _a, _b;
            var res =
              (_a = i.target) === null || _a === void 0 ? void 0 : _a.result;
            try {
              res
                .createObjectStore('test', {
                  autoIncrement: true,
                })
                .put(new Blob());
              __callback(false);
            } catch (e) {
              var message = e;
              if (e instanceof Error) {
                message = (_b = e.message) !== null && _b !== void 0 ? _b : e;
              }
              if (typeof message !== 'string') {
                return __callback(false);
              }
              var matchesExpectedError = /BlobURLs are not yet supported/.test(
                message
              );
              return __callback(matchesExpectedError);
            } finally {
              res.close();
              window.indexedDB.deleteDatabase(tmp_name);
            }
          };
        } catch (e) {
          return __callback(false);
        }
      }
      function oldSafariTest() {
        var openDB = window.openDatabase;
        var storage = window.localStorage;
        try {
          openDB(null, null, null, null);
        } catch (e) {
          return __callback(true);
        }
        try {
          storage.setItem('test', '1');
          storage.removeItem('test');
        } catch (e) {
          return __callback(true);
        }
        return __callback(false);
      }
      function safariPrivateTest() {
        if (navigator.maxTouchPoints !== undefined) {
          newSafariTest();
        } else {
          oldSafariTest();
        }
      }
      /**
       * Chrome
       **/
      function getQuotaLimit() {
        var w = window;
        if (
          w.performance !== undefined &&
          w.performance.memory !== undefined &&
          w.performance.memory.jsHeapSizeLimit !== undefined
        ) {
          return performance.memory.jsHeapSizeLimit;
        }
        return 1073741824;
      }
      // >= 76
      function storageQuotaChromePrivateTest() {
        navigator.webkitTemporaryStorage.queryUsageAndQuota(
          function (_, quota) {
            var quotaInMib = Math.round(quota / (1024 * 1024));
            var quotaLimitInMib =
              Math.round(getQuotaLimit() / (1024 * 1024)) * 2;
            __callback(quotaInMib < quotaLimitInMib);
          },
          function (e) {
            reject(
              new Error(
                'detectIncognito somehow failed to query storage quota: ' +
                  e.message
              )
            );
          }
        );
      }
      // 50 to 75
      function oldChromePrivateTest() {
        var fs = window.webkitRequestFileSystem;
        var success = function () {
          __callback(false);
        };
        var error = function () {
          __callback(true);
        };
        fs(0, 1, success, error);
      }
      function chromePrivateTest() {
        if (
          self.Promise !== undefined &&
          self.Promise.allSettled !== undefined
        ) {
          storageQuotaChromePrivateTest();
        } else {
          oldChromePrivateTest();
        }
      }
      /**
       * Firefox
       **/
      function firefoxPrivateTest() {
        __callback(navigator.serviceWorker === undefined);
      }
      /**
       * MSIE
       **/
      function msiePrivateTest() {
        __callback(window.indexedDB === undefined);
      }
      function main() {
        if (isSafari()) {
          browserName = 'Safari';
          safariPrivateTest();
        } else if (isChrome()) {
          browserName = identifyChromium();
          chromePrivateTest();
        } else if (isFirefox()) {
          browserName = 'Firefox';
          firefoxPrivateTest();
        } else if (isMSIE()) {
          browserName = 'Internet Explorer';
          msiePrivateTest();
        } else {
          reject(new Error('detectIncognito cannot determine the browser'));
        }
      }
      main();
    });
  };
})();
