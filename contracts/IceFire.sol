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
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
    string house;
    int8 age;
}

contract IceFire is ERC721 {
    FighterAttributes[] public defaultCharacters;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => FighterAttributes) public nftHolderAttributes;
    mapping(address => uint256) public nftHolders;

    // Data passed in to the contract when it's first created initializing the characters.
    // We're going to actually pass these values in from run.js.
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg,
        string[] memory house,
        int8[] memory age
    ) payable ERC721("Ice and Fire", "IAF") {
        // Loop through all the characters, and save their values in our contract so
        // we can use them later when we mint our NFTs.
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                FighterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDmg[i],
                    house: house[i],
                    age: age[i]
                })
            );
        }
        _tokenIds.increment();
    }

    function mintCharacterNFT(uint256 _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);
        nftHolderAttributes[newItemId] = FighterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage,
            house: defaultCharacters[_characterIndex].house,
            age: defaultCharacters[_characterIndex].age
        });
        nftHolders[msg.sender] = newItemId;
        _tokenIds.increment();
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        FighterAttributes memory fighterAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(fighterAttributes.hp);
        string memory strMaxHp = Strings.toString(fighterAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            fighterAttributes.attackDamage
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                fighterAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                fighterAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
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
}
