// Tamanho do canvas
const canvas = {
    width : 505,
    height: 606
}
const widthSquare = canvas.width / 5; // Largura de um quadrado
const heightSquare = (canvas.height / 10) * 1.37; // Altura de um quadrado
const correctionHeight = 20; // Correção da altura dos inimigos no canvas
const initialPosEnemy = -30; // Posição Inicial do inimigo no canvas
const initialHeightPlayer = canvas.height / 1.5; // Altura inicial do player no canvas
const initialWidthPlayer = widthSquare * 2; // Largura inicial do player no canvas
const collectPositionHorizontal = (widthSquare + 9) - (widthSquare * 2); // Posição horizontal inicial do objeto gem no canvas
const collectPositionVertical = (heightSquare * 4) + correctionHeight + 5; // Posição vertical inicial do objeto gem no canvas


/*
Classe do Inimigo:

constructor: com as posições horizontais e verticais,
a velocidade do inimigo e sua imagem.

update: multiplica o dt pela velocidade do inimigo,
para assim fazê-lo se mover horziontalmente pelo cenário.
Quando ultrapassa o tamanho da tela, ele retorna a posição
inicial (adotada como -30 de largura) e é gerada uma nova velocidade à ele.
*/

class Enemy {
    constructor(positionHorizontal, positionVertical, randomize = Math.floor(Math.random() * (400 - 120 + 1) + 120)) {
        this.x = positionHorizontal;
        this.y = positionVertical;
        this.sprite = 'images/enemy-bug.png';
        this.speed = randomize; // aleatoriza a velocidade do inimigo

        this.widthRect = widthSquare - 22; // largura do retângulo criado em volta do inimigo
        this.heightRect = heightSquare - correctionHeight; // altura do retângulo criado em volta do inimigo
    }

    update(dt) {
        if (scorePlayer.losingCount <= scorePlayer.maxDefeats) {
            // Se o número de derrotas for menor que o número máximo de derrotas permitidas
            this.x += (this.speed * dt);
        } else {
            // Caso não seja, ele retorna a posição original e a página recarrega
            this.x = initialPosEnemy;
            window.location.reload();
        }

        // Se ele ultrapassar o tamanho do canvas, ele retorna a sua posição horizontal original
        if (this.x > canvas.width) {
            this.x = initialPosEnemy;
            this.speed = Math.floor(Math.random() * (400 - 120 + 1) + 120);
        }

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

        ctx.globalAlpha = 0.0; // Opacidade do retângulo criado em volta do inimigo

        ctx.fillRect(this.x, this.y + heightSquare - 5, this.widthRect, this.heightRect); // desenha o retângulo

        ctx.globalAlpha = 1.0; // Opacidade do retângulo criado em volta do inimigo
    }

}

/*
Os três objetos inimigos estão no array abaixo
chamado de allEnemies.
*/

allEnemies = [
    enemyOne = new Enemy(initialPosEnemy, heightSquare - correctionHeight),
    enemyTwo = new Enemy(initialPosEnemy, (heightSquare * 2) - correctionHeight),
    enemyThree = new Enemy(initialPosEnemy, (heightSquare * 3) - correctionHeight)
];

// Checa as colisões entre o player e cada um dos inimigos
function checkCollisions() {
    if (player.x < enemyOne.x + enemyOne.widthRect && player.x + player.widthRect > enemyOne.x && player.y < enemyOne.y + enemyOne.heightRect && player.y + player.heightRect > enemyOne.y) {
        return true;
    } else if (player.x < enemyTwo.x + enemyTwo.widthRect && player.x + player.widthRect > enemyTwo.x && player.y < enemyTwo.y + enemyTwo.heightRect && player.y + player.heightRect > enemyTwo.y) {
        return true;
    } else if (player.x < enemyThree.x + enemyThree.widthRect && player.x + player.widthRect > enemyThree.x && player.y < enemyThree.y + enemyThree.heightRect && player.y + player.heightRect > enemyThree.y) {
        return true;
    }
}

// Checa se as gemas(verde ou azul) foram coletadas pelo player
function checkCollectGem() {
    if (player.x < gemBlue.x + gemBlue.widthRect && player.x + player.widthRect > gemBlue.x && player.y < gemBlue.y + gemBlue.heightRect && player.y + player.heightRect > gemBlue.y) {
        gemBlue.update(); // retorna a gema a posição original dela no canvas
        return true;
    } else if (player.x < gemGreen.x + gemGreen.widthRect && player.x + player.widthRect > gemGreen.x && player.y < gemGreen.y + gemGreen.heightRect && player.y + player.heightRect > gemGreen.y) {
        gemGreen.update(); // retorna a gema a posição original dela no canvas
        return true;
    } else if (player.x < gemOrange.x + gemOrange.widthRect && player.x + player.widthRect > gemOrange.x && player.y < gemOrange.y + gemOrange.heightRect && player.y + player.heightRect > gemOrange.y) {
        gemOrange.update();
        return true;
    } else if (player.x < newHeart.x + newHeart.widthRect && player.x + player.widthRect > newHeart.x && player.y < newHeart.y + newHeart.heightRect && player.y + player.heightRect > newHeart.y) {
        newHeart.update();
        return true;
    }
}

// Verifica se o player chegou a água e espera alguns instantes para retornar a função win()
function victoryTimeout() {
    if (player.y < 0) {
        return window.setTimeout(win, 120);
    }
}

// Faz o player retornar a posição original dele no canvas
function win() {
    player.x = initialWidthPlayer;
    player.y = initialHeightPlayer;
}


class Player {
    constructor() {
        this.x = initialWidthPlayer;
        this.y = initialHeightPlayer;
        this.sprite = 'images/char-boy.png';
        this.widthRect = widthSquare - 40; // Largura do retângulo em volta do player
        this.heightRect = heightSquare - correctionHeight; // Altura do retângulo em volta do player

    }

    // Faz o player se mover no canvas
    handleInput(e) {
        if (e == 'left') {
            this.x -= widthSquare; // Move o player um quadrado para esquerda

            // Se ele ultrapassar o tamanho do canvas à esquerda, faz ele retornar ao canvas no último quadrado da direita
            if (this.x < 0) {
                this.x = canvas.width - widthSquare;
            }
        }
        else if (e == 'right') {
            this.x += widthSquare; // Move o player um quadrado para direita

            // Se ele ultrapassar o tamanho do canvas à direita, faz ele retornar ao canvas no primeiro quadrado da esquerda
            if (this.x > canvas.width - widthSquare) {
                this.x = 0;
            }
        }
        else if (e == 'down') {
            this.y += heightSquare; // Move o player um quadrado para baixo

            // Se ele ultrapassar o tamanho do canvas na parte de baixo, faz ele retornar ao canvas no quadrado acima
            if (this.y > (heightSquare * 5)) {
                this.y = initialHeightPlayer;
            }

        }
        else if (e == 'up') {

            this.y -= heightSquare; // Move o player um quadrado para cima

            // Retorna o player pra sua posição inicial
            if (this.y < -20) {
                this.y = initialHeightPlayer;
            }

        }
    }

    update() {

        // Se for detectado uma colisão o player volta pra sua posição inicial
        if (checkCollisions()) {
            this.x = initialWidthPlayer;
            this.y = initialHeightPlayer;
            scorePlayer.losingCount += 1; // Adiciona 1 ao número de derrotas do player na class Score
            life.remainingLife -= 1; // Retira 1 das vidas restantes na class Life

        }

        // Se o player chegar a água, a gema ganha posições no canvas e começa a se mover
        if (victoryTimeout()) {
            gemBlue.x = -widthSquare; // Posição horizontal da gema azul
            gemBlue.y = heightSquare + (correctionHeight * 3.5); // Posição vertical da gema azul
            scorePlayer.winningCount += 1; // Aumenta 1 (equivalente a 8 no score) na contagem de vitórias

        }


        // Se o player conseguir coletar a gema
        if (checkCollectGem()) {
            scorePlayer.winningCount += 4; // Aumenta o score em 4 pontos para o player
            scorePlayer.gemsCollected += 1; // Aumenta 1 no número de gemas coletadas

            // Condição para a gema verde aparecer (acontece a cada 10 gemas azuis coletadas)
            if (scorePlayer.gemsCollected % 10 === 0) {
                gemGreen.x = -widthSquare; // Posição horizontal da gema verde
                gemGreen.y = heightSquare - correctionHeight; // Posição vertical da gema verde
                scorePlayer.winningCount += 20; // Aumenta o score em 20 pontos para o player
            }

            // Condição para a gema laranja aparecer (acontece a cada 25 gemas azuis coletadas)
            if (scorePlayer.gemsCollected % 25 === 0) {
                gemOrange.x = -widthSquare; // Posição horizontal da gema laranja
                gemOrange.y = heightSquare - correctionHeight; // Posição vertical da gema laranja
                scorePlayer.winningCount += 100; // Aumenta o score em 100 pontos para o player
                
            }

            // Condição para o coração aparecer (acontece a cada 26 gemas azuis coletadas)
            if (scorePlayer.gemsCollected % 26 === 0) {
                newHeart.x = -widthSquare; // Posição horizontal do coração de vida
                newHeart.y = heightSquare + (correctionHeight * 3.5); // Posição vertical do coração de vida
                life.remainingLife += 1; // Aumenta a life em 1 para o player
            }

        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

player = new Player(); // instancia o novo objeto player


// classe dos itens coletáveis (gemas azuis e verde)
class CollectableItems {
    constructor(randomize = Math.floor(Math.random() * (300 - 100 + 1) + 100)) {
        this.x; // Cria mas não declara nenhum valor a sua posição horizontal
        this.y; // Cria mas não declara nenhum valor a sua posição vertical
        this.speed = randomize; // Coloca a velocidade para aleatorizar
        this.sprite = 'images/gem-blue.png';

        this.width = heightSquare; // Largura da imagem da gema
        this.height = heightSquare + 40; // Altura da imagem da gema

        this.widthRect = widthSquare; // Largura do quadrado em volta da gema
        this.heightRect = heightSquare; // Altura do quadrado em volta da gema
    }

    update(dt) {
        this.x += (this.speed * dt); // Faz a gema se mover no canvas

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y + correctionHeight, this.width, this.height);

        ctx.globalAlpha = 0.0; // Opacidade do retângulo criado em volta do inimigo

        ctx.fillRect(this.x, this.y + heightSquare, this.widthRect, this.heightRect);

        ctx.globalAlpha = 1.0; // Opacidade do retângulo criado em volta do inimigo
    }
}

gemBlue = new CollectableItems(); // instancia o objeto gema azul como um novo item coletável
gemGreen = new CollectableItems(); // instancia o objeto gema verde como um novo item coletável
gemOrange = new CollectableItems(); // instancia o objeto gema laranja como um novo item coletável
newHeart = new CollectableItems(); // instancia o objeto coração como um novo item coletável
gemGreen.sprite = 'images/gem-green.png'; // Altera a imagem para a gema verde no objeto gema verde
gemOrange.sprite = 'images/gem-orange.png'; // Altera a imagem para a gema laranja no objeto gema laranja
newHeart.sprite = 'images/heart.png'; // Altera a imagem para o coração no objeto novo coração

// Classe que cria um Score para o player
class Score {
    constructor() {
        this.x = canvas.width - widthSquare; // Posição horizontal do score no canvas
        this.y = canvas.height; // Posição vertical do score no canvas
        this.winningCount = 0; // Score do player
        this.losingCount = 0; // Contagem de derrotas do player
        this.gemsCollected = 0; // Contagem de gemas coletadas pelo player
        this.maxDefeats = 8; // Estabelece como 8 o número máximo de derrotas do player
    }

    update() {

    }

    render() {
        ctx.font = '24px Verdana';
        ctx.fillStyle = 'blue';
        ctx.fillText(`Score:${this.winningCount}`, this.x - widthSquare, this.y - 30);
    }
}

scorePlayer = new Score(); // instancia o objeto scorePlayer como um novo score do player

// Cria a classe Deaths para contagem da Vida do player
class Deaths {
    constructor() {
        this.x = widthSquare; // Posição horizontal da Vida no canvas
        this.y = canvas.height; // Posição vertical da Vida no canvas
        this.remainingLife = 8; // Vidas restantes (começa com 8)
    }

    update() {


    }

    render() {
        ctx.font = '24px Verdana';
        ctx.fillStyle = 'red';
        ctx.fillText(`Life:${this.remainingLife}`, this.x, this.y - 30);
    }
}

life = new Deaths(); // instancia o novo objeto vida como uma nova Vida do player

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
})
