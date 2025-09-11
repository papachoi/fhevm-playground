# fhevm-playground

[![CI](https://github.com/papachoi/fhevm-playground/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/papachoi/fhevm-playground/actions/workflows/ci.yml) [![Security](https://github.com/papachoi/fhevm-playground/actions/workflows/security.yml/badge.svg?branch=main)](https://github.com/papachoi/fhevm-playground/actions/workflows/security.yml)


Small demos exploring confidential smart-contract patterns with Zama's TFHE library.
- Contracts: arithmetic pipelines, encrypted max, TFHE-native voting & auction (compile-only)
- Tooling: Hardhat + Node 22, GitHub Actions CI, Prettier

## Dev
```bash
npm ci
npx hardhat compile
npx hardhat test
Networks
Localhost: npx hardhat node (then deploy scripts)

Sepolia (optional): set SEPOLIA_RPC_URL and PRIVATE_KEY in .env

Scripts
npm run format / npm run checkfmt

npx hardhat run scripts/deploy_confidential_voting_tfhe.js --network localhost
