<template>
    <div class="elem">
        <div>
            <my-input
                v-if="(inputText.length > 0)"
                v-for="id in inputText.length"
                :inputText="inputText[id - 1]"
                :argId="id - 1"
                :clear="clearInput"
                @input="inputArgument"
                @clear="stopClear"
            >
            </my-input>
        </div>
        <button class="btn" @click="handler">Вызов функции контракта <strong>{{ buttonText }}</strong></button>
        <div class="field hide" :id="buttonText">
            <span 
                class="output"
                v-if="(readOnly === true)"
            >
                Результат: {{ result }}
            </span>
            <a 
                class="ref"
                v-else 
                target="_blank" 
                v-bind:href="result"
            >
                Просмотреть транзакцию на etherscan
            </a>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default{
    name: 'call-function',
    data() {
        return {
            result: '',
            args: [],
            clearInput: false
        }
    },
    props: {
        buttonText: {
            type: String,
            required: true
        },
        buttonHandler: {
            type: Function,
            required: true
        },
        inputText: {
            type: Array,
            default: []
        },
        readOnly: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapState({
            erc20Address: state => state.erc20Address,
            chain: state => state.chain
        })
    },
    methods: {
        inputArgument(eventData) {
            this.args[eventData.argId] = eventData.arg;
        },
        async handler() {
            if(this.erc20Address === "" && this.buttonText !== "constructor(address to, uint256 value)") {
                alert("Необходимо задеплоить контракт или подключиться к существующему!")
            } else {
                if(this.args.length != this.inputText.length) {
                    alert("Вы не указали аргументы!");
                } else {
                    if(this.readOnly) {
                        this.result = await this.$props.buttonHandler(this.args)
                    } else {
                        this.result = 'https://' + this.chain
                        if (this.chain !== 'main') {
                            this.result += '.'
                        }
                        this.result += 'etherscan.io/tx/' + await this.$props.buttonHandler(this.args)
                    }
                    this.clearInput = true;
                    args = [];
                    if (document.getElementById(this.buttonText).classList.contains('hide')) {
                        document.getElementById(this.buttonText).classList.remove('hide')
                    }
                }
            }
        },
        stopClear() {
            this.clearInput = false;
        }
    }
}
</script>

<style>
    .field {
        padding: 10px 0;
        margin-top: 5px;
    }
    .hide {
        visibility: hidden;
        display: inline;
    }
    .ref {
        text-decoration: none;
        background: none;
        padding: 10px 15px;
        margin-top: 5px;
        color: #000;
        border: 2px solid #079d31;
    }
    .ref:hover {
        border: 2px solid #49cf6f;
    }
    .ref:active {
        color: #464545;
    }
</style>