$(function () {

    /*-----------------------------------------------
     Play Video (Android issue)
     -------------------------------------------------*/

    // Android disabled autoplay in all players:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=159336

    /*var video = $('#introMovie')[0];
    if (video) {
        video.load();
        video.play();
        video.addEventListener('canplay', function () {
            video.play();
        }, false);
        video.addEventListener('click', function () {
            video[video.paused ? 'play' : 'pause']();
        }, false);
    }*/

    /*-----------------------------------------------
     Contact - Send Email
     -------------------------------------------------*/

    var $contactForm = $('#contact-form').submit(submitContactForm);
    var $contactFormBtn = $contactForm.find('.js-submit').click(function (e) {
        e.preventDefault();
        $contactForm.submit();
    });
    var $fields = $contactForm
        .find('[name]')
        .keyup(function () {
            toggleFormWarning($(this), false);
        });
    var $progress = $contactForm.find('.send-progress');


    function submitContactForm() {
        if (!validateContactForm()) {
            return false;
        }

        toggleSendProgress('sending');
        toggleSendProgress('sent', 1000);

        var url = "/api/send-contact";
        submitForm($contactForm, url, function (err, res) {
            toggleSendProgress(false, 5000);

            if (err) {
                console.log('>>Err: [%s] %s', err.status, err.httpStatus);
                //trackPageEvent(null, 'Contact Submit Error');
                return;
            }

            // TODO
            // trackPageEvent('/#index-send', 'Contact submitted');
        });

        return false; // prevent default
    }

    function validateContactForm() {
        var errors = validateForm($fields);
        if (errors.length) {
            $.each(errors, function (i, it) {
                toggleFormWarning(it.$el, true, it.error);
            });
            errors[0].$el.focus();
            return false;
        }

        return true;
    }

    function toggleSendProgress(className, delay) {
        var toggle = function () {
            $progress.toggleClass('sending sent', false);
            if (className) {
                $progress.toggleClass(className, true);
            }
        };

        if (delay) {
            setTimeout(toggle, delay);
        } else {
            toggle();
        }
    }

    /*-----------------------------------------------
     Util
     -------------------------------------------------*/

    // Ajax
    function submitForm($form, url, cb) {
        var data = getFormData($form);
        //console.log('>> POST: ', data);

        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                cb(null, res)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var err = {
                    status: textStatus,
                    httpStatus: errorThrown,
                    xhr: jqXHR
                };
                cb(err, null);
            }
        });

        //////

        function getFormData($form) {
            var arr = $form.serializeArray();
            var result = {};

            $.each(arr, function (i, o) {
                result[o.name] = o.value;
            });
            return result;
        }
    }

    // Form Validation
    function validateForm($fields) {
        // Returns: [ {$el: $(), error: 'required' | 'email'}, ...]
        var result = [];
        $fields.each(function (i, el) {
            var $el = $(el), error = null;
            if ($el.data('required') && !validateRequired($el.val())) {
                error = 'required';
            }
            else if ($el.data('email') && !validateEmail($el.val())) {
                error = 'email';
            }

            if (error) {
                result.push({
                    $el: $el,
                    error: error
                });
            }
        });
        return result;
    }

    function validateRequired(val) {
        val = val.trim();
        return !!val;
    }

    function validateEmail(val) {
        val = val.trim();
        var simpleEmailRe = /\S+@\S+\.\S+/;
        return simpleEmailRe.test(val);
    }

    function toggleFormWarning($el, on, errorClass) {
        var $group = $el.closest('.form-group');
        if (on) {
            $group.addClass('has-error ' + errorClass);
        } else {
            $group.removeClass('has-error email required');
        }
    }

    /*-----------------------------------------------
     Analytics
     -------------------------------------------------*/

    function trackPageEvent(url, text) {
        if (window.ga && url) {
            ga('send', 'pageview', url);
        }
        if (window.mixpanel && text) {
            mixpanel.track(text);
        }
        //console.log('>> Tracking [%s] [%s]', url, text, !window.ga ? '(skipped)' : '');
    }

    function trackGoogleConversion() {
        var w = window;
        if (typeof w.google_conversion_id === 'undefined') { return; }

        // Courtesy by Oz Wintrob
        var google_conversion_id = 957011799;
        var google_conversion_label = "d4AmCNzWgVoQ166ryAM";
        var image = new Image(1, 1);
        image.src = "//www.googleadservices.com/pagead/conversion/" + google_conversion_id
            + "/?label=" + google_conversion_label;
    }

});
