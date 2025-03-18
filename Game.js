const config = {
  type: Phaser.AUTO,
  width: 1920, // Usa a largura da janela
  height: 1080, // Usa a altura da janela
  scene: [Fase1, Fase2],
  scale: {
    mode: Phaser.Scale.FIT, // Ajusta automaticamente ao tamanho da tela
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centraliza a tela
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 700 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
