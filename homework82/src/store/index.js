import { createStore } from 'vuex';

import { erc20ABI } from '@/contracts/ERC20.abi.js';
import { erc20BIN } from '@/contracts/ERC20.bin.js';

const ethers = require('ethers');
const goerliProvider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/XdE1v9zVDSoRe6S5013cteykw1ZDC0u9');
const ganasheProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
const iErc20 = new ethers.utils.Interface(erc20ABI);
let currentProvider;
// 0xbe6125f245f3DC2426c4ABE07d590a05369Fe2B4

export default createStore({
    state: {
        provider: {},
        address: "",
        signer: "",
        chainId: "",
        chain: "",
        erc20: {},
        erc20Address: "",
    },
    getters: {
    },
    mutations: {
        addBlock(state, newBlock) {
            state.blocks.unshift(newBlock)
        }
    },
    actions: {
        async connectionWallet({ state }) {
            if (typeof window.ethereum !== 'undefined') {
                console.log("Ethereum client installed!")
                if (ethereum.isMetaMask === true) {
                    console.log("Metamask installed!")
                    if (ethereum.isMetaMask !== true) {
                        console.log("Metamask is not installed!")
                        await ethereum.enable()
                    } 
                    console.log("Metamask connected!")
                }
                else{
                    alert("Metamask is not installed!")
                }
            } 
            else {
                alert("Ethereum client is not installed!")
            }      
            // создаем провайдера
            state.provider = new ethers.providers.Web3Provider(ethereum);
            // параметры сети
            state.chainId = await window.ethereum.request({ method: 'eth_chainId'});
            if(state.chainId == '0x1') {
                state.chain = 'main';
            } else if(state.chainId == '0x5') {
                state.chain = 'goerli';
                currentProvider = goerliProvider;
            } else if(state.chainId == '0xaa36a7') {
                state.chain = 'sepolia';
            } else if(state.chainId == '0x539') {
                state.chain = 'ganache';
                currentProvider = ganasheProvider; 
            };
            // создание интерфейса
            // const iErc20 = new ethers.utils.Interface(erc20ABI);
            // подключение аккаунта
            ethereum.request({ method: "eth_requestAccounts" })
            .then(accounts => {
                state.address = ethers.utils.getAddress(accounts[0]);
                state.signer = state.provider.getSigner();
                console.log(`Account ${state.address} connected!`);
            })
            // смена аккаунта
            ethereum.on('accountsChanged', (accounts) => {
                state.address = ethers.utils.getAddress(accounts[0]);
                state.signer = state.provider.getSigner();
                console.log(`accounts changed to ${state.address}!`);
            }) 
            // смена сети
            ethereum.on('chainChanged', async (chainId) => {
                // создаем провайдера
                state.provider = new ethers.providers.Web3Provider(ethereum);
                // параметры сети
                state.chainId = await window.ethereum.request({ method: 'eth_chainId'});
                if(state.chainId == '0x1') {
                    state.chain = 'main';
                } else if(state.chainId == '0x5') {
                    state.chain = 'goerli';
                    currentProvider = goerliProvider;
                } else if(state.chainId == '0xaa36a7') {
                    state.chain = 'sepolia';
                } else if(state.chainId == '0x539') {
                    state.chain = 'ganache';
                    currentProvider = ganasheProvider;
                };
                console.log("chainId changed to ", state.chainId);
            })
        },
        async deployErc20({state}, args) {
            const [name, symbol, decimals] = args;
            let ERC20 = new ethers.ContractFactory(erc20ABI, erc20BIN);
            const data = ERC20.getDeployTransaction(name, symbol, decimals).data;
            await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    data: data
                }]
            })
            .then(async (hash) => {
                const tx = await currentProvider.getTransaction(hash);
                const receipt = await tx.wait();
                state.erc20Address = receipt.contractAddress;
                state.erc20 = new ethers.Contract(state.erc20Address, erc20ABI, currentProvider);
            });
        },
        async connectErc20({state}, erc20Address) {
            state.erc20Address = erc20Address;
            state.erc20 = new ethers.Contract(state.erc20Address, erc20ABI, currentProvider);
            console.log(state.erc20);
        },
        async mint({state}, args) {
            const [to, value] = args;
            const data = iErc20.encodeFunctionData("mint", [to, value]);
            return await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    to: state.erc20Address,
                    data: data
                }]
            })
        },
        async approve({state}, args) {
            const [spender, value] = args;
            const data = iErc20.encodeFunctionData("approve", [spender, value]);
            return await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    to: state.erc20Address,
                    data: data
                }]
            })
        },
        async transfer({state}, args) {
            const [to, value] = args;
            const data = iErc20.encodeFunctionData("transfer", [to, value]);
            return await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    to: state.erc20Address,
                    data: data
                }]
            })
        },
        async transferFrom({state}, args) {
            const [from, to, value] = args;
            const data = iErc20.encodeFunctionData("transferFrom", [from, to, value]);
            return await ethereum.request({
                method: "eth_sendTransaction",
                params:[{
                    from: state.address,
                    to: state.erc20Address,
                    data: data
                }]
            })
        },
        async getName({state}) {
            return await state.erc20.name();
        },
        async symbol({state}) {
            return await state.erc20.symbol();
        },
        async decimals({state}) {
            return await state.erc20.decimals();
        },
        async totalSupply({state}) {
            return await state.erc20.totalSupply();
        },
        async balanceOf({state}, arg) {
            const account = arg[0];
            return await state.erc20.balanceOf(account);
        },
        async allowance({state}, args) {
            const [owner, spender] = args;
            return await state.erc20.allowance(owner, spender);
        }
    },
    modules: {
    }
})
