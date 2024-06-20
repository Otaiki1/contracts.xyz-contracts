# AgreementContract

## Overview

The AgreementContract is a Solidity smart contract that facilitates the creation and management of agreements between parties, where each agreement is associated with Soul Bound NFTs (Non-Fungible Tokens) that represent the agreement. These NFTs can contain metadata that is linked to the agreement details.

## Features

-   Creation of agreements between parties.
-   Signing of agreements by the involved parties.
-   Minting of Soul Bound NFTs associated with signed agreements.
-   Retrieval of agreement details and associated NFTs.
-   Separate tracking of agreements initiated by each party.
-   Ownership control to set the NFT contract address.

## Technologies Used

This smart contract is developed using the Ethereum blockchain and leverages the following technologies:

-   **Solidity**: The contract is written in Solidity, the programming language used for developing smart contracts on the Ethereum platform.

-   **OpenZeppelin Contracts**: OpenZeppelin is a widely-used library for secure smart contract development. This contract uses OpenZeppelin's ERC721URIStorage for NFT functionality and Ownable for access control.

-   **Counters**: The Counters library is used for counting and managing token IDs.

-   **Polygon**: The contract is deployed on the Base blockchain, utilizing its distributed ledger and smart contract capabilities.

## Usage

1. **Creating an Agreement**:

    - To create a new agreement, parties call the `createAgreement` function, specifying the address of the second party and the desired metadata URI for the associated NFT. Also the first party signs the agreement automatically.

2. **Signing the Agreement**:

    - The second party signs the agreement using the `party2SignAgreement` function.

3. **Minting the Soul Bound NFT**:

    - Once both parties have signed the agreement, either party can mint the associated Soul Bound NFT using the `mintNFTAgreement` function.

4. **Retrieving Agreement Details and NFTs**:

    - Parties can retrieve agreement details using the `getAgreementDetails` function.
    - Parties can also retrieve their initiated and received agreements using `getParty1Agreements` and `getParty2Agreements`, respectively.

5. **Setting the NFT Contract Address**:
    - The owner can set the address of the NFT contract using the `setNFTAddress` function.
      SBT contract deployed to 0xd782af367FFfb8DDF5e453704EA514e66D9403ca
      Agreement contract deployed to 0x271C7936f116F71B9B670322C5574171C44A284E

## Deployment

-   This Contract was deployed to the base Sepolia blockchain
-   Agreement contract deployed to [0x271C7936f116F71B9B670322C5574171C44A284E](https://sepolia.basescan.org/address/0x271C7936f116F71B9B670322C5574171C44A284E)
-   SBT contract deployed to [0xd782af367FFfb8DDF5e453704EA514e66D9403ca](https://sepolia.basescan.org/address/0xd782af367FFfb8DDF5e453704EA514e66D9403ca)

## License

This contract is released under the MIT License, providing users with the freedom to use, modify, and distribute the code.
