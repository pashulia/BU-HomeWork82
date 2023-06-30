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
</style>