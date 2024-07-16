def test_get_card(client):
    response = client.get("/card/NotACard")
    assert response.status_code == 404
    response = client.get("/card/100038")
    assert response.status_code == 200
    assert response.json == {
        "backrefs": [],
        "blood_cost": None,
        "conviction_cost": None,
        "disciplines": [],
        "groups": [],
        "img": "https://static.krcg.org/card/alastor.jpg",
        "name": "Alastor",
        "pool_cost": None,
        "printed_name": "Alastor",
        "rulings": [
            {
                "cards": {},
                "group": None,
                "references": [
                    #"[LSJ 20040518]": 
                    {
                        "uid": "LSJ 20040518",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/4emymfUPwAM/B2SCC7L6kuMJ"
                        ),
                    },
                ],
                "status": "approved",
                "symbols": {},
                "text": "If the weapon retrieved costs blood, that cost is paid by the "
                "vampire chosen by the vote. [LSJ 20040518]",
            },
            {
                "cards": {
                    "{Inscription}": {
                        "img": "https://static.krcg.org/card/inscription.jpg",
                        "name": "Inscription",
                        "prefix": "",
                        "printed_name": "Inscription",
                        "symbols": {},
                        "uid": "100989",
                        "unique_name": "Inscription",
                    },
                },
                "group": None,
                "references": {
                    "[ANK 20200901]": {
                        "uid": "ANK 20200901",
                        "url": (
                            "http://www.vekn.net/forum/rules-questions/"
                            "78830-alastor-and-ankara-citadel#100653"
                        ),
                    },
                    "[LSJ 20040518-2]": {
                        "uid": "LSJ 20040518-2",
                        "url": (
                            "https://groups.google.com/g/rec.games.trading-cards.jyhad/"
                            "c/4emymfUPwAM/m/JF_o7OOoCbkJ"
                        ),
                    },
                },
                "status": "approved",
                "symbols": {},
                "text": "Requirements do not apply. If a discipline is required (eg. "
                "{Inscription}) and the Alastor vampire does not have it, the "
                "inferior version is used. [ANK 20200901] [LSJ 20040518-2]",
            },
        ],
        "symbols": {
            "POLITICAL ACTION": "2",
        },
        "text": "Requires a justicar or Inner Circle member.\n"
        "Choose a ready Camarilla vampire. If this referendum is successful, "
        "search your library for an equipment card and place this card and the "
        "equipment on the chosen vampire. Pay half the cost (round down) of the "
        "equipment. This vampire may enter combat with any vampire controlled by "
        "another Methuselah as a +1 stealth Ⓓ action. This vampire cannot commit "
        "diablerie. A vampire may have only one Alastor.",
        "text_symbols": {},
        "types": [
            "Political Action",
        ],
        "uid": "100038",
        "unique_name": "Alastor",
    }


def test_get_group(client):
    response = client.get("/group/NotAGroup")
    assert response.status_code == 404
    response = client.get("/group/G00008")
    assert response.status_code == 200
    assert response.json == {
        "cards": [
            {
                "img": "https://static.krcg.org/card/childrenofosiris.jpg",
                "name": "Children of Osiris",
                "prefix": "",
                "printed_name": "Children of Osiris",
                "symbols": {},
                "uid": "100339",
                "unique_name": "Children of Osiris",
            },
            {
                "img": "https://static.krcg.org/card/coma.jpg",
                "name": "Coma",
                "prefix": "[DEM]",
                "printed_name": "Coma",
                "symbols": {
                    "[DEM]": "E",
                },
                "uid": "100378",
                "unique_name": "Coma",
            },
            {
                "img": "https://static.krcg.org/card/derange.jpg",
                "name": "Derange",
                "prefix": "",
                "printed_name": "Derange",
                "symbols": {},
                "uid": "100527",
                "unique_name": "Derange",
            },
            {
                "img": "https://static.krcg.org/card/detection.jpg",
                "name": "Detection",
                "prefix": "",
                "printed_name": "Detection",
                "symbols": {},
                "uid": "100533",
                "unique_name": "Detection",
            },
            {
                "img": "https://static.krcg.org/card/faeriewards.jpg",
                "name": "Faerie Wards",
                "prefix": "[MYT]",
                "printed_name": "Faerie Wards",
                "symbols": {
                    "[MYT]": "X",
                },
                "uid": "100690",
                "unique_name": "Faerie Wards",
            },
            {
                "img": "https://static.krcg.org/card/fantasyworld.jpg",
                "name": "Fantasy World",
                "prefix": "",
                "printed_name": "Fantasy World",
                "symbols": {},
                "uid": "100701",
                "unique_name": "Fantasy World",
            },
            {
                "img": "https://static.krcg.org/card/flashgrenade.jpg",
                "name": "Flash Grenade",
                "prefix": "",
                "printed_name": "Flash Grenade",
                "symbols": {},
                "uid": "100745",
                "unique_name": "Flash Grenade",
            },
            {
                "img": "https://static.krcg.org/card/lextalionis.jpg",
                "name": "Lextalionis",
                "prefix": "",
                "printed_name": "Lextalionis",
                "symbols": {},
                "uid": "101099",
                "unique_name": "Lextalionis",
            },
            {
                "img": "https://static.krcg.org/card/libertyclubintrigue.jpg",
                "name": "Liberty Club Intrigue",
                "prefix": "",
                "printed_name": "Liberty Club Intrigue",
                "symbols": {},
                "uid": "101101",
                "unique_name": "Liberty Club Intrigue",
            },
            {
                "img": "https://static.krcg.org/card/mindnumb.jpg",
                "name": "Mind Numb",
                "prefix": "",
                "printed_name": "Mind Numb",
                "symbols": {},
                "uid": "101211",
                "unique_name": "Mind Numb",
            },
            {
                "img": "https://static.krcg.org/card/mindrape.jpg",
                "name": "Mind Rape",
                "prefix": "",
                "printed_name": "Mind Rape",
                "symbols": {},
                "uid": "101215",
                "unique_name": "Mind Rape",
            },
            {
                "img": "https://static.krcg.org/card/mummystongue.jpg",
                "name": "Mummy's Tongue",
                "prefix": "",
                "printed_name": "Mummy's Tongue",
                "symbols": {},
                "uid": "101252",
                "unique_name": "Mummy's Tongue",
            },
            {
                "img": "https://static.krcg.org/card/rotschreck.jpg",
                "name": "Rötschreck",
                "prefix": "",
                "printed_name": "Rötschreck",
                "symbols": {},
                "uid": "101654",
                "unique_name": "Rötschreck",
            },
            {
                "img": "https://static.krcg.org/card/rowanring.jpg",
                "name": "Rowan Ring",
                "prefix": "",
                "printed_name": "Rowan Ring",
                "symbols": {},
                "uid": "101655",
                "unique_name": "Rowan Ring",
            },
            {
                "img": "https://static.krcg.org/card/sensorydeprivation.jpg",
                "name": "Sensory Deprivation",
                "prefix": "",
                "printed_name": "Sensory Deprivation",
                "symbols": {},
                "uid": "101721",
                "unique_name": "Sensory Deprivation",
            },
            {
                "img": "https://static.krcg.org/card/serpentsnumbingkiss.jpg",
                "name": "Serpent's Numbing Kiss",
                "prefix": "[PRE][SER]",
                "printed_name": "Serpent's Numbing Kiss",
                "symbols": {
                    "[PRE]": "R",
                    "[SER]": "S",
                },
                "uid": "101727",
                "unique_name": "Serpent's Numbing Kiss",
            },
            {
                "img": "https://static.krcg.org/card/shacklesofenkidu.jpg",
                "name": "Shackles of Enkidu",
                "prefix": "",
                "printed_name": "Shackles of Enkidu",
                "symbols": {},
                "uid": "101733",
                "unique_name": "Shackles of Enkidu",
            },
            {
                "img": "https://static.krcg.org/card/sheepdog.jpg",
                "name": "Sheepdog",
                "prefix": "",
                "printed_name": "Sheepdog",
                "symbols": {},
                "uid": "101762",
                "unique_name": "Sheepdog",
            },
            {
                "img": "https://static.krcg.org/card/snipehunt.jpg",
                "name": "Snipe Hunt",
                "prefix": "",
                "printed_name": "Snipe Hunt",
                "symbols": {},
                "uid": "101815",
                "unique_name": "Snipe Hunt",
            },
            {
                "img": "https://static.krcg.org/card/spikethrower.jpg",
                "name": "Spike-Thrower",
                "prefix": "",
                "printed_name": "Spike-Thrower",
                "symbols": {},
                "uid": "101846",
                "unique_name": "Spike-Thrower",
            },
            {
                "img": "https://static.krcg.org/card/toreadorgrandball.jpg",
                "name": "Toreador Grand Ball",
                "prefix": "",
                "printed_name": "Toreador Grand Ball",
                "symbols": {},
                "uid": "101989",
                "unique_name": "Toreador Grand Ball",
            },
            {
                "img": "https://static.krcg.org/card/visionquest.jpg",
                "name": "Visionquest",
                "prefix": "",
                "printed_name": "Visionquest",
                "symbols": {},
                "uid": "102125",
                "unique_name": "Visionquest",
            },
            {
                "img": "https://static.krcg.org/card/woodenstake.jpg",
                "name": "Wooden Stake",
                "prefix": "",
                "printed_name": "Wooden Stake",
                "symbols": {},
                "uid": "102192",
                "unique_name": "Wooden Stake",
            },
        ],
        "name": "Do Not Unlock as Normal",
        "rulings": [
            {
                "cards": {},
                "group": {
                    "name": "Do Not Unlock as Normal",
                    "uid": "G00008",
                },
                "references": {
                    "[LSJ 20050114]": {
                        "uid": "LSJ 20050114",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/JWiZmyC2Y6s/q6JHYrE1zKYJ"
                        ),
                    },
                },
                "status": "approved",
                "symbols": {},
                "text": (
                    'The "does not unlock as normal" effect is redundant with being '
                    "infernal. If the minion is infernal, his controller can still pay "
                    "a pool to unlock him. [LSJ 20050114]"
                ),
            },
        ],
        "status": "approved",
        "uid": "G00008",
    }
