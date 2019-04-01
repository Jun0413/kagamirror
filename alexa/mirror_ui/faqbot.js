const faqbotVendor = `<strong style="font-size: 1.2em;">FAQ bot</strong> <span style="font-size: 0.8em;">&nbsp; powered by Alexa &amp; AWS</span>`;

const faqbotTitleR = `<div><i>Listening...</i></div>
<svg class="audiowave" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 38.05">
    <title>Audio Wave</title>
    <path id="audiline_1" data-name="Line 1" d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z"/>
    <path id="audiline_2" data-name="Line 2" d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z"/>
    <path id="audiline_3" data-name="Line 3" d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z"/>
    <path id="audiline_4" data-name="Line 4" d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z"/>
    <path id="audiline_5" data-name="Line 5" d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z"/>
    <path id="audiline_6" data-name="Line 6" d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z"/>
    <path id="audiline_7" data-name="Line 7" d="M36.91,0L36.78,0A1,1,0,0,0,36,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H36.91Z"/>
    <path id="audiline_8" data-name="Line 8" d="M42.91,9L42.78,9A1,1,0,0,0,42,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H42.91Z"/>
    <path id="audiline_9" data-name="Line 9" d="M48.91,15l-0.12,0A1,1,0,0,0,48,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H48.91Z"/>
</svg>`;

const faqbotPrompt = `<div style="text-align: center; font-size: 1.3em; line-height: 1.5em;">
Step 1. "Alexa, open Q and A"<br>
Step 2. Ask a question within EEE FAQ (<u>QRcode</u> below)<br>
E.g. "What is industrial attachment?"<br>
<img src="../alexa/asset/qrcode/eeefaq.svg" style="width: 80px;height: 80px;margin-top: 10px">
</div>`;

function startFAQBot() {
    $("head").find("link#style-faqbot").remove();
    $("head").append(`<link rel="stylesheet" href="../alexa/mirror_ui/faqbot.css" id="style-faqbot"></link>`);
    $(".voiceint-vendor").fadeOut("slow", function() {
        $(this).html(faqbotVendor).fadeIn("slow");
    });
    $(".voiceint-title-right").fadeOut("slow", function() {
        $(this).html(faqbotTitleR).fadeIn("slow");
    });
    $(".voiceint-message").fadeOut("slow", function() {
        $(this).html(faqbotPrompt).fadeIn("slow", removeSpeechGraderStyling);
    });
}

function stopFAQBot() {
    $(".voiceint-vendor").fadeOut("slow", function() { $(this).empty(); });
    $(".voiceint-title-right").fadeOut("slow", function() { $(this).empty(); });
    $(".voiceint-message").html("").fadeIn("slow");
    $("head").find("link#style-faqbot").remove();
}

function startAnswer(answer) {
    $(".voiceint-message").fadeOut('slow', function() {
        $(this).html(answer).fadeIn('slow');
    });
}