//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// NFT contract to inherit from.
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./libraries/Base64.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

struct FighterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 healthPoints;
    uint256 maxHealthPoints;
    uint256 attackDamage;
    string house;
    uint8 age;
}

struct Fighter {
    uint256 tokenId;
    uint256 createdAt;
    FighterAttributes attributes;
}

contract IceFire is ERC721 {
    FighterAttributes[] public defaultCharacters;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => Fighter) public nftHolderAttributes;
    mapping(uint256 => address) public nftHolders;
    mapping(address => uint256[]) private playerNFT;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(
        address sender,
        uint256 attackerHealthPoints,
        uint256 defenderHealthPoints
    );

    // Data passed in to the contract when it's first created initializing the characters.
    // We're going to actually pass these values in from run.js.
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHealthPoints,
        uint256[] memory characterAttackDmg,
        string[] memory house,
        uint8[] memory age
    ) payable ERC721("Ice and Fire", "IAF") {
        // Loop through all the characters, and save their values in our contract so
        // we can use them later when we mint our NFTs.
        _tokenIds.increment();
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                FighterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    healthPoints: characterHealthPoints[i],
                    maxHealthPoints: characterHealthPoints[i],
                    attackDamage: characterAttackDmg[i],
                    house: house[i],
                    age: age[i]
                })
            );
        }
    }

    function mintCharacterNFT(uint256 _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);
        nftHolderAttributes[newItemId] = Fighter({
            attributes: FighterAttributes({
                characterIndex: _characterIndex,
                name: defaultCharacters[_characterIndex].name,
                imageURI: defaultCharacters[_characterIndex].imageURI,
                healthPoints: defaultCharacters[_characterIndex].healthPoints,
                maxHealthPoints: defaultCharacters[_characterIndex]
                    .maxHealthPoints,
                attackDamage: defaultCharacters[_characterIndex].attackDamage,
                house: defaultCharacters[_characterIndex].house,
                age: defaultCharacters[_characterIndex].age
            }),
            tokenId: newItemId,
            createdAt: block.timestamp
        });
        nftHolders[newItemId] = msg.sender;
        playerNFT[msg.sender].push(newItemId);
        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
        _tokenIds.increment();
    }

    function getPlayerNFTs() public view returns (uint256[] memory) {
        return playerNFT[msg.sender];
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        Fighter memory fighterAttributes = nftHolderAttributes[_tokenId];

        string memory strHealthPoints = Strings.toString(
            fighterAttributes.attributes.healthPoints
        );
        string memory strMaxHealthPoints = Strings.toString(
            fighterAttributes.attributes.maxHealthPoints
        );
        string memory strAttackDamage = Strings.toString(
            fighterAttributes.attributes.attackDamage
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                fighterAttributes.attributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                fighterAttributes.attributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHealthPoints,
                ', "max_value":',
                strMaxHealthPoints,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackPlayer(uint256 attackerTokenId, uint256 defenderTokenId)
        external
    {
        Fighter storage attacker = nftHolderAttributes[attackerTokenId];
        Fighter storage defender = nftHolderAttributes[defenderTokenId];

        require(
            nftHolders[attackerTokenId] == msg.sender,
            "You are not the owner of NFT"
        );

        require(
            attacker.attributes.healthPoints > 0,
            "Attacker does not have enough Health Points"
        );
        require(
            defender.attributes.healthPoints > 0,
            "Defender does not have enough Health Points"
        );
        if (
            defender.attributes.healthPoints < attacker.attributes.attackDamage
        ) {
            defender.attributes.healthPoints = 0;
        } else {
            defender.attributes.healthPoints =
                defender.attributes.healthPoints -
                attacker.attributes.attackDamage;
        }
        emit AttackComplete(
            msg.sender,
            attacker.attributes.healthPoints,
            defender.attributes.healthPoints
        );
    }

    function getUserNFTAttributes(uint256 _tokenId)
        public
        view
        returns (Fighter memory)
    {
        Fighter memory emptyStruct;
        if (nftHolders[_tokenId] != address(0)) {
            return nftHolderAttributes[_tokenId];
        } else {
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters()
        public
        view
        returns (FighterAttributes[] memory)
    {
        return defaultCharacters;
    }
}
