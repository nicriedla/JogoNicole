class Fase2 extends Phaser.Scene {
    constructor() {
        super({ key: "Fase2" }); // Define a chave para esta cena
    }

    preload() {
        // Carrega as imagens para a tela
        this.load.image("youWin", "src/assets/youWin.jpg");
        this.load.image("btnRestart", "src/assets/btnRestart.png");
    }

    create() {
        // Adiciona a imagem de "Você Venceu" ao centro da tela e aumenta a imagem
        this.add.image(1920 / 2, 1080 / 2.2, "youWin").setScale(3.6);

        // Adiciona o botão de reiniciar à tela, escala-o e o torna interativo
        const button = this.add.image(1920 / 2, 1080 / 1.4, "btnRestart").setScale(1.7).setInteractive();

        // Quando o botão for clicado, a pessoa é redirecionada para a tela Fase1
        button.on("pointerdown", () => {
            this.scene.start("Fase1"); // Inicia a cena "Fase1"
        });
    }
}
