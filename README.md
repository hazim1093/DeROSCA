# DeROSCA
A decentralised ROSCA (Tandas/Susu/Kameti/Hui) implementation

[![Lint Status](https://github.com/hazim1093/DeROSCA/workflows/DeROSCA%20CI/badge.svg)](https://github.com/hazim1093/DeROSCA/actions?query=workflow%3A%22DeROSCA+CI%22+branch%3Amain)
[![Security Status](https://github.com/hazim1093/DeROSCA/workflows/DeROSCA%20CI/badge.svg)](https://github.com/hazim1093/DeROSCA/actions?query=workflow%3A%22DeROSCA+CI%22+branch%3Amain)
[![Test Status](https://github.com/hazim1093/DeROSCA/workflows/DeROSCA%20CI/badge.svg)](https://github.com/hazim1093/DeROSCA/actions?query=workflow%3A%22DeROSCA+CI%22+branch%3Amain)
[![Gas Analysis Status](https://github.com/hazim1093/DeROSCA/workflows/DeROSCA%20CI/badge.svg)](https://github.com/hazim1093/DeROSCA/actions?query=workflow%3A%22DeROSCA+CI%22+branch%3Amain)

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
