const sgVendor = "<strong>Speech Grader</strong> powered by Google Speech API";

const sgPrompt = `<div style="text-align: center; font-size: 1.3em; line-height: 1.5em;">To grade your speech, you need to answer 3 simple open-ended questions one by one.<br>For each question, you have 10 seconds to think and after beep you have 20 seconds to answer.<br>We evaluate based on grammar, speech rate, transcription confidence, but not answer content.<br>This is just a toy-version and does not claim responsibility for the result.</div>`;

function startSpeechGrader() {
    $("head").find("link#style-speechgrader").remove();
    $("head").append(`<link rel="stylesheet" href="../amadeus/mirror_ui/speech_grader.css" id="style-speechgrader">`);
    $(".voiceint-vendor").fadeOut("slow", function() {
        $(this).html(sgVendor).fadeIn("slow");
    });
    $(".voiceint-message").fadeOut("slow", function() {
        $(this).html(sgPrompt).fadeIn("slow");
    });
    $(".voiceint-title-right").fadeOut("slow");
    $("head").find("link#style-faqbot").remove();
}

function startQuestion(question) {
    $(".voiceint-message").fadeOut('slow', function() {
        $(this).html(`<div style="text-align: center; font-size: 1.3em; line-height: 1.5em;">${question}</div>`).fadeIn('slow');
    });
}