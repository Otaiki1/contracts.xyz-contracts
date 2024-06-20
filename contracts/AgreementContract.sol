// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface ISoulBoundToken {
    function safeMint(address to, string memory metadataURI) external;
    function currentTokenId() external returns (uint);
}

contract AgreementContract {
    address public nftContractAddress;
    address immutable owner;
    ISoulBoundToken public nftContract;

    uint256 public agreementCounter;

    struct Agreement {
        address party1;
        address party2;
        bool party1Signed;
        bool party2Signed;
        uint party1Id;
        uint party2Id;
        string tokenUri;
    }

    mapping(uint256 => Agreement) public agreements;
    mapping(address => uint256[]) private initiator;
    mapping(address => uint256[]) private party;

    event AgreementCreated(uint256 indexed agreementId, address indexed party1, address indexed party2, string tokenUri);
    event AgreementSigned(uint256 indexed agreementId, address indexed party);
    event AgreementMinted(uint256 indexed agreementId, address indexed party, uint256 indexed tokenId);
    event AgreementDeleted(uint256 indexed agreementId, address indexed party1);

    error NotAllowed();
    error InvalidParty();
    error AlreadySigned();
    error NotSignedByParty1();
    error InvalidAgreementId();
    error UnauthorizedDelete();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAllowed();
        _;
    }

    function createAgreement(address _party2, string memory _tokenUri) public {
        agreementCounter++;

        Agreement memory newAgreement = Agreement({
            party1: msg.sender,
            party2: _party2,
            party1Signed: true,
            party2Signed: false,
            party1Id: 0,
            party2Id: 0,
            tokenUri: _tokenUri
        });

        agreements[agreementCounter] = newAgreement;
        initiator[msg.sender].push(agreementCounter);
        party[_party2].push(agreementCounter);

        emit AgreementCreated(agreementCounter, msg.sender, _party2, _tokenUri);
    }

    function party2SignAgreement(uint256 _agreementId) public {
        Agreement storage agreement = agreements[_agreementId];
        if (msg.sender != agreement.party2) revert InvalidParty();
        if (!agreement.party1Signed) revert NotSignedByParty1();
        if (agreement.party2Signed) revert AlreadySigned();

        agreement.party2Signed = true;
        emit AgreementSigned(_agreementId, msg.sender);
    }

    function mintNFTAgreement(uint256 _agreementId) public {
        Agreement storage agreement = agreements[_agreementId];
        if (msg.sender != agreement.party2 && msg.sender != agreement.party1) revert NotAllowed();
        if (!agreement.party1Signed || !agreement.party2Signed) revert NotSignedByParty1();

        string memory metadataURI = agreement.tokenUri;

        nftContract.safeMint(msg.sender, metadataURI);
        uint256 tokenId = nftContract.currentTokenId();
        if (agreement.party1 == msg.sender) {
            agreement.party1Id = tokenId;
        }
        if (agreement.party2 == msg.sender) {
            agreement.party2Id = tokenId;
        }

        emit AgreementMinted(_agreementId, msg.sender, tokenId);
    }

    function getAgreementDetails(uint256 _agreementId) public view returns (Agreement memory) {
        if (agreements[_agreementId].party1 == address(0)) revert InvalidAgreementId();
        return agreements[_agreementId];
    }

    function deleteContract(uint256 _agreementId) public {
        if (msg.sender != agreements[_agreementId].party1 || agreements[_agreementId].party2Signed) revert UnauthorizedDelete();
        delete agreements[_agreementId];
        // emit an event if needed
    }

    function getParty1Agreements() public view returns (uint256[] memory) {
        return initiator[msg.sender];
    }

    function getParty2Agreements() public view returns (uint256[] memory) {
        return party[msg.sender];
    }

    function setNFTAddress(address _nftContractAddress) public onlyOwner {
        nftContractAddress = _nftContractAddress;
        nftContract = ISoulBoundToken(_nftContractAddress);
    }
}
