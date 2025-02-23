# DeROSCA
A decentralised ROSCA (Tandas/Susu/Kameti/Hui) implementation

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
