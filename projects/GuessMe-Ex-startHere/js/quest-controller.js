'use strict';

// NOTE: This is a global used only in the controller
var gLastRes = null;

$(document).ready(init);
$('.btn-start').click(onStartGuessing);
$('.btn-yes').click({ ans: 'yes' }, onUserResponse);
$('.btn-no').click({ ans: 'no' }, onUserResponse);
$('.btn-add-guess').click(onAddGuess);

function init() {
  console.log('Started...');
  createQuestsTree();
}

function onStartGuessing() {
  var $elTitle = $('header h1')
  $elTitle.text('Guess Who')
  var $elStartSection = $('.game-start')
  $elStartSection.hide()
  renderQuest();
  var $elQuestSection = $('.quest')
  $elQuestSection.show()
}

function renderQuest() {
  var currQuest = getCurrQuest()
  var $elQuestion = $('.quest h2')
  $elQuestion.text(currQuest.txt)
}

function onUserResponse(ev) {
  var res = ev.data.ans;
  if (isChildless(getCurrQuest())) {
    if (res === 'yes') {
      var $elNewQuestSect = $('.quest')
      $elNewQuestSect.hide()
      var $elTitle = $('header h1')
      $elTitle.text('I guessed it! Play again?')
      onRestartGame()
    } else {
      var $elQuestSection = $('.quest')
      $elQuestSection.hide()
      var $elNewQuestSect = $('.new-quest')
      $elNewQuestSect.show()
    }
  } else {
    gLastRes = res
    moveToNextQuest(res);
    renderQuest();
  }
}

function onAddGuess(ev) {
  ev.preventDefault();
  var newGuess = $('#newGuess').val();
  var newQuest = $('#newQuest').val();
  addGuess(newQuest, newGuess, gLastRes)

  onRestartGame();
}

function onRestartGame() {
  $('.new-quest').hide();
  $('.game-start').show();
  gLastRes = null;
  backToFirstQuest()
}
