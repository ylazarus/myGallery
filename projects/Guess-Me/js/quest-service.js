'use strict'

const STORAGE_KEY = 'QuestDB'

var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;

function createQuestsTree() {
    var tree = loadFromStorage(STORAGE_KEY)
    if (tree) {
        gQuestsTree = tree
    } else {
        gQuestsTree = createQuest('Is it a girl?');
        gQuestsTree.yes = createQuest('Is it Mom?');
        gQuestsTree.no = createQuest('Is it Dad?');
    }
    gCurrQuest = gQuestsTree;
    gPrevQuest = null;
}

function createQuest(txt) {
    return {
        txt: txt,
        yes: null,
        no: null
    }
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}

function moveToNextQuest(res) {
    gPrevQuest = gCurrQuest //not sure if this is correct
    gCurrQuest = (res === 'yes') ? gPrevQuest.yes : gPrevQuest.no
    // TODO: update the gPrevQuest, gCurrQuest global vars
}

function addGuess(newQuestTxt, newGuessTxt, lastRes) {
    var newQuestion = createQuest(newQuestTxt)
    newQuestion.yes = createQuest(newGuessTxt)
    if (lastRes === 'yes') {
        newQuestion.no = gPrevQuest.yes
        gPrevQuest.yes = newQuestion

    } else {
        newQuestion.no = gPrevQuest.no
        gPrevQuest.no = newQuestion

    }
    _saveTreeToStorage()
    // TODO: Create and Connect the 2 Quests to the questions tree
}

function getCurrQuest() {
    return gCurrQuest
}

function backToFirstQuest() {
    gCurrQuest = gQuestsTree;
    gPrevQuest = null;
}

function _saveTreeToStorage() {
    saveToStorage(STORAGE_KEY, gQuestsTree)
}

