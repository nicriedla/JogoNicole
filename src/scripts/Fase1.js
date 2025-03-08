class Fase1 extends Phaser.Scene {
  constructor() {
    super({ key: "Fase1" });
  }

  preload() {
    // Carrega as imagens e spritesheets necessárias para o jogo
    this.load.image("Background1", "src/assets/bg.png"); 
    this.load.image("Bloco", "src/assets/tijolos.png"); 
    this.load.image("porta", "src/assets/door.png"); 
    this.load.spritesheet("Player", "src/assets/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    }); // Spritesheet do jogador
    this.load.spritesheet("coin", "src/assets/coin.png", {
      frameWidth: 400,
      frameHeight: 400,
    }); // Spritesheet das moedas
  }

  create() {
    var largura = 1720; // Posição inicial dos blocos no eixo X
    var altura = 450; // Posição inicial dos blocos no eixo Y
    var largura2 = 1345; // Posição inicial das moedas no eixo X
    var altura2 = 460; // Posição inicial das moedas no eixo Y
    var pontuacao = 0; // Variável que armazena a pontuação do jogo
    var placar;

    // Adiciona a imagem de fundo e redimensiona para cobrir toda a tela
    let bg = this.add.image(0, 0, "Background1");
    bg.setOrigin(0, 0);
    bg.setDisplaySize(1920, 1080); // Ajusta ao tamanho da tela

    // Atualiza a imagem se a tela for redimensionada
    this.scale.on("resize", (gameSize) => {
      bg.setDisplaySize(gameSize.width, gameSize.height);
    });

    // Cria um grupo de blocos
    this.blocoGroup = this.physics.add.staticGroup();
    for (var i = 0; i <= 4; i++) {
      this.blocoGroup.create(largura, altura, "Bloco");
      largura = largura - 375; // Ajusta a posição X para o próximo bloco
      altura = altura + 100; // Ajusta a posição Y para o próximo bloco
    }

    // Configura as teclas de controle
    this.cursors = this.input.keyboard.createCursorKeys();

    // Cria o jogador e define suas propriedades
    this.player1 = this.physics.add
      .sprite(225, 650, "Player")
      .setScale(1.5) // Aumenta o tamanho
      .setCollideWorldBounds(true);

    // Adiciona colisão entre o jogador e os blocos
    this.physics.add.collider(this.player1, this.blocoGroup);

    // Reinicia a cena se o jogador sair dos limites do mundo
    this.player1.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", () => {
      this.scene.restart();
    });

    // Cria as animações do jogador
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("Player", { start: 8, end: 13 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("Player", { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("Player", { start: 18, end: 23 }),
      frameRate: 7,
      repeat: 0,
    });

    // Cria um grupo de moedas 
    this.coinGroup = this.physics.add.staticGroup();
    for (var i = 0; i <= 2; i++) {
      let coin = this.coinGroup
        .create(largura2, altura2, "coin")
        .setScale(0.175); // Reduz o tamanho das moedas
      coin.body.setSize(coin.width * 0.15, coin.height * 0.15); // Ajusta o tamanho do corpo da moeda
      coin.body.setOffset(
        (coin.width - coin.body.width) / 2,
        (coin.height - coin.body.height) / 2
      ); // Centraliza o corpo da moeda
      largura2 = largura2 - 375; // Ajusta a posição X para a próxima moeda
      altura2 = altura2 + 100; // Ajusta a posição Y para a próxima moeda
    }

    // Adiciona colisão entre as moedas e os blocos
    this.physics.add.collider(this.coinGroup, this.blocoGroup);

    // Cria a animação das moedas
    this.anims.create({
      key: "coin",
      frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });
    this.coinGroup.children.iterate((coin) => {
      coin.anims.play("coin", true);
    });

    // Adiciona o placar na tela
    placar = this.add.text(115, 78, "Moedas: " + pontuacao, {
      fontSize: "45px", 
      fill: "#495613", 
    });

    // Adiciona a lógica de coleta de moedas
    this.physics.add.overlap(this.player1, this.coinGroup, (player, coin) => {
      coin.destroy(); // Remove a moeda da tela
      pontuacao += 1; // Incrementa a pontuação
      placar.setText("Moedas: " + pontuacao); // Atualiza o placar
    });

    // Adiciona a imagem da porta na última plataforma
    let nextSceneImage = this.add.image(1725, 320, "porta").setScale(0.4);
    this.physics.add.existing(nextSceneImage);
    nextSceneImage.body.setAllowGravity(false); // Desativa a gravidade para a porta
    nextSceneImage.body.setImmovable(true); // Torna a porta imóvel

    // Adiciona a lógica de transição para a próxima fase
    this.physics.add.overlap(this.player1, nextSceneImage, () => {
      this.scene.start("Fase2"); // Inicia a próxima fase
    });
  }

  update() {
    // Verifica se o jogador está tocando o chão
    if (this.player1.body.touching.down) {
      this.isJumping = false;
    }

    // Lógica de movimento do jogador
    if (this.cursors.up.isDown && this.player1.body.touching.down) {
      this.player1.setVelocityY(-400); // Faz o jogador pular
      this.player1.anims.play("jump", true); // Toca a animação de pulo
      this.isJumping = true;
    } else if (this.cursors.left.isDown) {
      this.player1.setVelocityX(-260); // Move o jogador para a esquerda
      this.player1.setFlip(true); // Inverte a imagem do jogador
      this.player1.anims.play("run", true); // Toca a animação de corrida
    } else if (this.cursors.right.isDown) {
      this.player1.setVelocityX(260); // Move o jogador para a direita
      this.player1.setFlip(false); // Desinverte a imagem do jogador
      this.player1.anims.play("run", true); // Toca a animação de corrida
    } else if (!this.isJumping) {
      this.player1.setVelocityX(0); // Para o movimento do jogador
      this.player1.anims.play("idle", true); // Toca a animação de idle
    }
  }
}
