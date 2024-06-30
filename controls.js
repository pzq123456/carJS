export class Controls{
    constructor(controlType ){
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.nitro = false; // 氮气加速
        switch(controlType){
            case 'KEYS':
                this.#addEventListeners();
                break;
            case 'DUMMY':
                this.up = true;
                break;
        }
        // this.#addEventListeners();
    }

    #addEventListeners(){
        document.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'ArrowUp':
                    this.up = true;
                    break;
                case 'ArrowDown':
                    this.down = true;
                    break;
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
                // nitro space
                case ' ':
                    this.nitro = true;
                    break;
                // reset the game
                case 'r':
                    location.reload();
                    break;
                
            }

        });

        document.addEventListener('keyup', (event) => {
            switch(event.key){
                case 'ArrowUp':
                    this.up = false;
                    break;
                case 'ArrowDown':
                    this.down = false;
                    break;
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
                // nitro space
                case ' ':
                    this.nitro = false;
                    break;
            }

        });
    }
}