# DeROSCA
A decentralised ROSCA (Tandas/Susu/Kameti/Hui) implementation

[![Lint](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml/badge.svg?branch=main&event=push&job=lint)](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml)
[![Security Analysis](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml/badge.svg?branch=main&event=push&job=security)](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml)
[![Test](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml/badge.svg?branch=main&event=push&job=test)](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml)
[![Gas Analysis](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml/badge.svg?branch=main&event=push&job=gas-analysis)](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml)

## How to Run

Compile:
```sh
npx hardhat compile
```

Run Tests:
```shell
npx hardhat test test/myCon.ts
```

Deploy:
```shell
npx hardhat node # on a separate shell
npx hardhat ignition deploy ./ignition/modules/myCon.ts --network localhost
```
