<template>
    <div class="main">
        <h3>Информация о приложении</h3>
        <div class="main">
            <p>Данное приложение создано для работы с токенами ERC20</p>
            <p>1. Подключите Metamask</p>
            <p>2. Задеплойте новый токен или подключитесь к задеплоиному
                (например <a href="https://goerli.etherscan.io/address/0xbe6125f245f3DC2426c4ABE07d590a05369Fe2B4#code" target="_blank">0xbe6125f245f3DC2426c4ABE07d590a05369Fe2B4</a>)
            </p>
            <p>3. Работайте с функциями через интерфейс</p>
        </div>
    </div>
    <div class="main">
        <h3>Поодключение Metamask</h3>
        <div class="main">
            <button class="btn" @click="connectionWallet">
                Подключить Metamask
            </button>
            <p class="output">Адрес аккаунта: {{ $store.state.address }}</p>
            <p class="output">ID цепи: {{ $store.state.chainId }}</p>
            <p class="output">Имя цепи: {{ $store.state.chain }}</p>
        </div>
    </div>   
    <div class="main">
        <h3>Подключиться к существуещему контракту токена ERC20</h3>
        <div>
            <div>
                <input class="input" v-model="erc20Address" placeholder="Введите адрес контракта токена ERC20">
            </div>
            <button class="btn" @click="connect">Подключиться к контракту</button>
        </div>
    </div>
    <div class="main">
        <h3>Задеплоить новый контракт ERC20</h3>
        <call-function
            buttonText="constructor(address to, uint256 value)"
            :buttonHandler="deployErc20"
            :inputText="['name', 'symbol', 'decimals']"
            :readOnly="false"
        >
        </call-function>
    </div>
    <div class="main">
        <h3>Текущий контракт</h3>
        <div class="elem">
            <p class="output">Адрес контракта: {{ $store.state.erc20Address }}</p>
            <p class="output">ID цепочки: {{ $store.state.chainId }}</p>
        </div>
    </div>
    <div class="main">
        <h3>Платные функции</h3>
        <call-function
            buttonText="mint(address to, uint256 value)"
            :buttonHandler="mint"
            :inputText="['to', 'value']"
            :readOnly="false"
        >
        </call-function>
        <call-function
            buttonText="approve(address spender, uint256 value)"
            :buttonHandler="approve"
            :inputText="['spender', 'value']"
            :readOnly="false"
        >
        </call-function>
        <call-function
            buttonText="transfer(address to, uint256 value)"
            :buttonHandler="transfer"
            :inputText="['to', 'value']"
            :readOnly="false"
        >
        </call-function>
        <call-function
            buttonText="transferFrom(address from, address to, uint256 value)"
            :buttonHandler="transferFrom"
            :inputText="['from', 'to', 'value']"
            :readOnly="false"
        >
        </call-function>
    </div>
    <div class="main">
        <h3>Бесплатные функции</h3>
        <call-function
            buttonText="name"
            :buttonHandler="getName"
        >
        </call-function>
        <call-function
            buttonText="symbol"
            :buttonHandler="symbol"
        >
        </call-function>
        <call-function
            buttonText="decimals"
            :buttonHandler="decimals"
        >
        </call-function>
        <call-function
            buttonText="totalSupply"
            :buttonHandler="totalSupply"
        >
        </call-function>
        <call-function
            buttonText="balanceOf(address account)"
            :buttonHandler="balanceOf"
            :inputText="['account']"
        >
        </call-function>
        <call-function
            buttonText="allowance(address owner, address spender)"
            :buttonHandler="allowance"
            :inputText="['owner', 'spender']"
        >
        </call-function>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            erc20Address: '',
        }
    },
    methods: {
        ...mapActions({
            connectionWallet: 'connectionWallet',
            deployErc20: 'deployErc20',
            connectErc20: 'connectErc20',
            mint: 'mint',
            approve: 'approve',
            transfer: 'transfer',
            transferFrom: 'transferFrom',
            mint: 'mint',
            getName: 'getName',
            symbol: 'symbol',
            decimals: 'decimals',
            totalSupply: 'totalSupply',
            balanceOf: 'balanceOf',
            allowance: 'allowance',
        }),
        async connect() {
            await this.connectErc20(this.erc20Address);
        }
    }
}
</script>

<style>
h3 {
    text-align: center;
    margin: 5px 0 10px;
}
    .main {
        padding: 15px;
        border: 1px solid #9a9999;
        margin-bottom: 30px;
    }
    .elem {
        padding: 15px;
        border: 1px solid #d5d3d3;
        margin-bottom: 30px;
    }
    .btn {
        padding: 10px 15px;
        background: #8888e5;
        color: #000;
        border: 2px solid #000;
    }
    .btn:hover {
        background: #b4b4ec;
    }
    .btn:active {
        color: #fff;
    }
    .input {
        width: 350px;
        margin-bottom: 5px;
        padding: 10px 15px;
    }
    .output {
        padding: 10px 15px;
        background: none;
        color: #000;
        border: 2px solid #079d31;
        margin-top: 5px;
    }
</style>