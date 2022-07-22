'use strict';

(() => {

  const container = document.querySelector('.container');

  // Перемешивание алгоритмом Фишера-Йетса =======================
  const shuffle = arr => {
    let j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }
  // ==============================================================

  // Стартовый экран
  const createStartScreen = () => {
    const startScreenWrapper = document.createElement('div');
    const startTitle = document.createElement('h2');
    const form = document.createElement('form');
    const verticalInput = document.createElement('input');
    const horizonInput = document.createElement('input');
    const timeTitle = document.createElement('h2');
    const timeInput = document.createElement('input');
    const startButton = document.createElement('button');

    startScreenWrapper.classList.add('wrapper', 'screen');
    startTitle.classList.add('screen__title');
    form.classList.add('screen__start-form', 'start-form');
    verticalInput.classList.add('start-form__vertical', 'start-form__input');
    horizonInput.classList.add('start-form__horizon', 'start-form__input');
    timeTitle.classList.add('start-form__time-title');
    timeInput.classList.add('start-form__time-input', 'start-form__input');
    startButton.classList.add('start-form__button');

    startButton.textContent = 'Начать игру!';

    startScreenWrapper.append(startTitle);
    startScreenWrapper.append(form);

    form.append(horizonInput);
    form.append(verticalInput);
    form.append(timeTitle);
    form.append(timeInput);
    form.append(startButton);

    startButton.addEventListener('click', (e) => {
      e.preventDefault();
      const verticalCount = parseInt(startScreen.verticalInput.value);
      const horizonCount = parseInt(startScreen.horizonInput.value);

      if ((verticalCount * horizonCount) % 2 !== 0) {
        startScreen.startTitle.textContent = 'Нужно четное количество карточек';
        startScreen.startTitle.classList.add('error-title')
        startScreen.verticalInput.classList.add('error-input');
        startScreen.horizonInput.classList.add('error-input');
        return;
      }

      if (!startScreen.timeInput.value) {
        startScreen.timeTitle.textContent = 'Нужно указать количество секунд';
        startScreen.timeTitle.classList.add('error-title');
        startScreen.timeInput.classList.add('error-input');
        return;
      }

      waitTime = parseInt(startScreen.timeInput.value);

      createGameApp(verticalCount, horizonCount, startScreen.startScreenWrapper);
    });

    return {
      startScreenWrapper: startScreenWrapper,
      startTitle: startTitle,
      form: form,
      timeTitle: timeTitle,
      timeInput: timeInput,
      verticalInput: verticalInput,
      horizonInput: horizonInput,
      startButton: startButton
    }
  }
  // =============================================================================

  // Список карточек =============================================================
  const createCardsList = () => {
    const cardsList = document.createElement('ul');
    cardsList.classList.add('list-reset', 'game-field');
    return cardsList;
  }
  // =============================================================================

  // Карточка ====================================================================
  const createCard = () => {
    const card = document.createElement('li');
    const frontSide = document.createElement('div');
    const reverseSide = document.createElement('img');

    card.classList.add('game-field__card', 'card');
    frontSide.classList.add('card__front-side');
    reverseSide.classList.add('card__reverse-side');

    card.append(frontSide);
    card.append(reverseSide);

    reverseSide.src = 'assets/img/back2.jpeg';

    return {
      card: card,
      frontSide: frontSide,
      reverseSide: reverseSide,
    }
  }
  // =============================================================================

  // Окно таймера ================================================================
  const createCountDown = () => {
    const countDownBlock = document.createElement('div');
    const countDownTitle = document.createElement('h2');
    const countDownScreen = document.createElement('div');

    countDownBlock.append(countDownTitle);
    countDownBlock.append(countDownScreen);

    countDownBlock.classList.add('countdown');
    countDownTitle.classList.add('countdown__title');
    countDownScreen.classList.add('countdown__screen');

    return {
      countDownBlock: countDownBlock,
      countDownTitle: countDownTitle,
      countDownScreen: countDownScreen
    }
  }
  // ============================================================================

  // Финальный экран =============================================================
  const createFinishScreen = () => {
    const finishScreenWrapper = document.createElement('div');
    const finishTitle = document.createElement('h1');
    const buttonWrapper = document.createElement('div');
    const yesButton = document.createElement('button');
    const noButton = document.createElement('button');

    finishScreenWrapper.classList.add('wrapper', 'screen');
    finishTitle.classList.add('screen__title');
    buttonWrapper.classList.add('screen__button-group');
    yesButton.classList.add('screen__button-yes');
    noButton.classList.add('screen__button-no');

    yesButton.textContent = 'Хочу еще';
    noButton.textContent = 'Больше не хочу';

    finishScreenWrapper.append(finishTitle);
    finishScreenWrapper.append(buttonWrapper);
    buttonWrapper.append(yesButton);
    buttonWrapper.append(noButton);

    return {
      finishScreenWrapper: finishScreenWrapper,
      finishTitle: finishTitle,
      buttonWrapper: buttonWrapper,
      yesButton: yesButton,
      noButton: noButton
    }
  }
  // ======================================================================

  // Приложение ===========================================================

  const countDownBlock = createCountDown();
  const cardsList = createCardsList();

  const createGameApp = (verticalCount, horizonCount, startScreen) => {
    const totalCount = verticalCount * horizonCount;
    closePairs = totalCount / 2;

    startScreen.remove();

    container.append(countDownBlock.countDownBlock);
    if (countDownBlock.countDownScreen.textContent !== null) {
      countDownBlock.countDownScreen.textContent = null;
      countDownBlock.countDownTitle.classList.remove('finish-countdown');
      countDownBlock.countDownTitle.textContent = 'До конца игры осталось...';
    }

    cardsList.innerHTML = '';
    container.append(cardsList);

    const cardsArray = [];
    let index = 1;

    for (let i = 0; i < totalCount; i++) {

      const card = createCard();
      card.card.setAttribute('data-index', index);
      if (totalCount > 16) {
        card.card.classList.add('card-small');
        card.frontSide.classList.add('card__front-side_small');
      }
      card.frontSide.textContent = index;
      cardsArray.push(card.card);
      card.card.addEventListener('click', turnCard);
      index++;
      if (index === totalCount / 2 + 1) {
        index = 1;
      }
    }

    const result = shuffle(cardsArray);

    result.forEach(randomeCard => {
      cardsList.append(randomeCard);
    });

    startCountDown();
  }
  // =======================================================================

  // Старт игры ============================================================
  const startScreen = createStartScreen();

  const startGame = () => {
    resetGameField();

    const lastFinishScreen = document.querySelector('.wrapper');
    if (lastFinishScreen) lastFinishScreen.remove();

    const lastCountDownScreen = document.querySelector('.countdown__screen');
    if (lastCountDownScreen) lastCountDownScreen.remove();

    if (startScreen.verticalInput.value || startScreen.horizonInput.value || startScreen.timeInput.value) {
      startScreen.verticalInput.value = startScreen.horizonInput.value = startScreen.timeInput.value = null;
    }

    container.append(startScreen.startScreenWrapper);
    startScreen.startTitle.textContent = 'Количество карточек по вертикали/горизонтали';
    startScreen.timeTitle.textContent = 'За сколько секунд справишься?)';

    if (startScreen.startTitle.classList.contains('error-title')) {
      startScreen.startTitle.classList.remove('error-title');
      startScreen.verticalInput.classList.remove('error-input');
      startScreen.horizonInput.classList.remove('error-input');
    }
    if (startScreen.timeTitle.classList.contains('error-title')) {
      startScreen.timeTitle.classList.remove('error-title');
      startScreen.timeInput.classList.remove('error-input');
    }
  }
  // ========================================================================

  // Таймер обратного отсчета ==============================================
  let waitTime;
  let timerID;

  const countDown = () => {
    waitTime--;
    countDownBlock.countDownScreen.textContent = waitTime;
    if (closePairs === 0 && waitTime !== 0) {
      winTheGame();
    } else if (closePairs !== 0 && waitTime === 0) {
      loosingTheGame();
    }
  }

  const startCountDown = () => {
    clearInterval(timerID);
    timerID = setInterval(countDown, 1000);
  }
  // =========================================================================

  // Процесс игры ============================================================
  let hasTurnedCard = false;
  let lockGameField = false;
  let firstCard;
  let secondCard;
  let closePairs;

  const turnCard = e => {
    if (lockGameField) return;

    const target = e.target.parentElement;
    if (target === firstCard) return;
    target.classList.add('turn');

    if (!hasTurnedCard) {
      hasTurnedCard = true;
      firstCard = target;
    } else {
      hasTurnedCard = false;
      secondCard = target;
      checkForMatch();
    }
  }

  const checkForMatch = () => {
    const isEqual = firstCard.dataset.index === secondCard.dataset.index;

    isEqual ? disabledCards() : unTurnCards();
  }

  const disabledCards = () => {
    closePairs -= 1;
    firstCard.removeEventListener('click', turnCard);
    secondCard.removeEventListener('click', turnCard);
  }

  const unTurnCards = () => {
    lockGameField = true;

    setTimeout(() => {
      if (firstCard) {
        firstCard.classList.remove('turn');
        secondCard.classList.remove('turn');
        resetGameField();
      }
    }, 1000);
  }

  const resetGameField = () => {
    hasTurnedCard = lockGameField = false;
    firstCard = secondCard = null;
  }

  // Окончание игры ==========================================================
  const finishScreen = createFinishScreen();

  const finishGame = () => {

    cardsList.remove();
    countDownBlock.countDownBlock.remove();

    container.append(finishScreen.finishScreenWrapper);

    finishScreen.yesButton.addEventListener('click', startGame);
    finishScreen.noButton.addEventListener('click', () => {
      finishScreen.buttonWrapper.remove();
      finishScreen.finishTitle.textContent = 'Еще увидимся!...';
      setTimeout(() => {
        finishScreen.finishScreenWrapper.remove();
      }, 2000);
    });
  }

  const winTheGame = () => {
    console.log('WIN');
    clearInterval(timerID);
    setTimeout(() => {
      finishGame();
      finishScreen.finishTitle.textContent = 'Это победа!!! Сыграем еще?';
    }, 1000);
  }

  const loosingTheGame = () => {
    console.log('LOOSE');
    clearInterval(timerID);
    countDownBlock.countDownTitle.classList.add('finish-countdown');
    countDownBlock.countDownTitle.textContent = 'Время закончилось...';
    setTimeout(() => {
      finishScreen.finishTitle.textContent = 'Тебе не хватило времени... Сыграем еще?';
      finishGame();
    }, 1000);
  }
  // =======================================================================

  startGame();
})();
