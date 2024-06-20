import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgreementContract", function () {
  async function deployContractsFixture() {
    const [owner, party1, party2, otherAccount] = await ethers.getSigners();

    const SoulBoundToken = await ethers.getContractFactory("SoulBoundToken");
    const soulBoundToken = await SoulBoundToken.deploy();
    // await soulBoundToken.deployed();

    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const agreementContract = await AgreementContract.deploy(soulBoundToken.target);
    // await agreementContract.deployed();

    // await agreementContract.setNFTAddress(soulBoundToken.target);

    return { agreementContract, soulBoundToken, owner, party1, party2, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the correct NFT contract address", async function () {
      const { agreementContract, soulBoundToken } = await loadFixture(deployContractsFixture);
      expect(await agreementContract.nftContract()).to.equal(soulBoundToken.target);
    });
  });

  describe("Agreement Creation and Signing", function () {
    it("Should create an agreement and sign by party1", async function () {
      const { agreementContract, party1, party2 } = await loadFixture(deployContractsFixture);
      const tokenURI = "https://example.com/token/1";

      await agreementContract.connect(party1).createAgreement(party2.address, tokenURI);

      const agreement = await agreementContract.agreements(1);
      expect(agreement.party1).to.equal(party1.address);
      expect(agreement.party2).to.equal(party2.address);
      expect(agreement.tokenUri).to.equal(tokenURI);
      expect(agreement.party1Signed).to.be.true;
      expect(agreement.party2Signed).to.be.false;
    });

    it("Should allow party2 to sign the agreement", async function () {
      const { agreementContract, party1, party2 } = await loadFixture(deployContractsFixture);
      const tokenURI = "https://example.com/token/1";

      await agreementContract.connect(party1).createAgreement(party2.address, tokenURI);
      await agreementContract.connect(party2).party2SignAgreement(1);

      const agreement = await agreementContract.agreements(1);
      expect(agreement.party2Signed).to.be.true;
    });

    it("Should not allow other accounts to sign the agreement", async function () {
      const { agreementContract, party1, party2, otherAccount } = await loadFixture(deployContractsFixture);
      const tokenURI = "https://example.com/token/1";

      await agreementContract.connect(party1).createAgreement(party2.address, tokenURI);

      await expect(agreementContract.connect(otherAccount).party2SignAgreement(1))
        .to.be.revertedWithCustomError(agreementContract, "InvalidParty()")
    });
  });

  describe("Minting NFT", function () {
    it("Should mint an NFT after both parties sign", async function () {
      const { agreementContract, soulBoundToken, party1, party2 } = await loadFixture(deployContractsFixture);
      const tokenURI = "https://example.com/token/1";

      await agreementContract.connect(party1).createAgreement(party2.address, tokenURI);
      await agreementContract.connect(party2).party2SignAgreement(1);

      await agreementContract.connect(party1).mintNFTAgreement(1);
      await agreementContract.connect(party2).mintNFTAgreement(1);

      const agreement = await agreementContract.agreements(1);
      console.log("Agreements ----_______-----", agreement)
      expect(agreement.party1Id).to.equal(0);
      expect(agreement.party2Id).to.equal(1);
      const tokenId = agreement.party1Id;
      expect(await soulBoundToken.ownerOf(tokenId)).to.equal(party1.address);
    });

    it("Should not mint an NFT if both parties have not signed", async function () {
      const { agreementContract, party1, party2 } = await loadFixture(deployContractsFixture);
      const tokenURI = "https://example.com/token/1";

      await agreementContract.connect(party1).createAgreement(party2.address, tokenURI);

      await expect(agreementContract.connect(party1).mintNFTAgreement(1))
        .to.be.revertedWithCustomError(agreementContract, "NotSignedByParty1()");
    });
  });

  describe("Delete Agreement", function () {
    it("Should delete an agreement by party1 if party2 hasn't signed", async function () {
      const { agreementContract, party1, party2 } = await loadFixture(deployContractsFixture);
      const tokenURI = "https://example.com/token/1";

      await agreementContract.connect(party1).createAgreement(party2.address, tokenURI);
      await agreementContract.connect(party1).deleteContract(1);

      await expect(agreementContract.getAgreementDetails(1)).to.be.revertedWithCustomError(agreementContract, "InvalidAgreementId()");
    });

    it("Should not allow non-party1 to delete an agreement", async function () {
      const { agreementContract, party1, party2, otherAccount } = await loadFixture(deployContractsFixture);
      const tokenURI = "https://example.com/token/1";

      await agreementContract.connect(party1).createAgreement(party2.address, tokenURI);

      await expect(agreementContract.connect(otherAccount).deleteContract(1))
        .to.be.revertedWithCustomError(agreementContract, "UnauthorizedDelete()");
    });

    it("Should not allow party1 to delete an agreement if party2 has signed", async function () {
      const { agreementContract, party1, party2 } = await loadFixture(deployContractsFixture);
      const tokenURI = "https://example.com/token/1";

      await agreementContract.connect(party1).createAgreement(party2.address, tokenURI);
      await agreementContract.connect(party2).party2SignAgreement(1);

      await expect(agreementContract.connect(party1).deleteContract(1))
        .to.be.revertedWithCustomError(agreementContract, "UnauthorizedDelete()");
    });
  });

  describe("SoulBoundToken", function () {
    it("Should mint an NFT with the correct metadata URI", async function () {
      const { soulBoundToken, owner } = await loadFixture(deployContractsFixture);
      const metadataURI = "testtest";
      const finalURI = "https://ipfs.io/testtest"
      await soulBoundToken.safeMint(owner.address, metadataURI);

      const tokenId = await soulBoundToken.currentTokenId();

      expect(await soulBoundToken.tokenURI(tokenId)).to.equal(finalURI);
    });

    
  });
});
