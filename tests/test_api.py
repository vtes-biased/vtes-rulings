def test_get_card(client):
    response = client.get("/card/NotACard")
    assert response.status_code == 404
    response = client.get("/card/100038")
    assert response.status_code == 200
    assert response.json == {
        "blood_cost": None,
        "conviction_cost": None,
        "disciplines": [],
        "groups": [],
        "img": "https://static.krcg.org/card/alastor.jpg",
        "name": "Alastor",
        "pool_cost": None,
        "printed_name": "Alastor",
        "symbols": [{"text": "POLITICAL ACTION", "symbol": "2"}],
        "text": "Requires a justicar or Inner Circle member.\n"
        "Choose a ready Camarilla vampire. If this referendum is successful, "
        "search your library for an equipment card and place this card and the "
        "equipment on the chosen vampire. Pay half the cost (round down) of the "
        "equipment. This vampire may enter combat with any vampire controlled by "
        "another Methuselah as a +1 stealth Ⓓ action. This vampire cannot commit "
        "diablerie. A vampire may have only one Alastor.",
        "text_symbols": [],
        "types": ["POLITICAL ACTION"],
        "uid": "100038",
        "rulings": [
            {
                "uid": "SZD7UL3B",
                "target": {"name": "Alastor", "uid": "100038"},
                "cards": [],
                "references": [
                    {
                        "text": "[LSJ 20040518]",
                        "date": "2004-05-18",
                        "source": "LSJ",
                        "uid": "LSJ 20040518",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/4emymfUPwAM/B2SCC7L6kuMJ"
                        ),
                    },
                ],
                "symbols": [],
                "text": "If the weapon retrieved costs blood, that cost is paid by the "
                "vampire chosen by the vote. [LSJ 20040518]",
            },
            {
                "uid": "KHQHCLMP",
                "target": {"name": "Alastor", "uid": "100038"},
                "cards": [
                    {
                        "img": "https://static.krcg.org/card/inscription.jpg",
                        "name": "Inscription",
                        "printed_name": "Inscription",
                        "text": "{Inscription}",
                        "uid": "100989",
                    },
                ],
                "references": [
                    {
                        "text": "[ANK 20200901]",
                        "uid": "ANK 20200901",
                        "date": "2020-09-01",
                        "source": "ANK",
                        "url": (
                            "http://www.vekn.net/forum/rules-questions/"
                            "78830-alastor-and-ankara-citadel#100653"
                        ),
                    },
                    {
                        "text": "[LSJ 20040518-2]",
                        "uid": "LSJ 20040518-2",
                        "date": "2004-05-18",
                        "source": "LSJ",
                        "url": (
                            "https://groups.google.com/g/rec.games.trading-cards.jyhad/"
                            "c/4emymfUPwAM/m/JF_o7OOoCbkJ"
                        ),
                    },
                ],
                "symbols": [],
                "text": "Requirements do not apply. If a discipline is required (eg. "
                "{Inscription}) and the Alastor vampire does not have it, the "
                "inferior version is used. [ANK 20200901] [LSJ 20040518-2]",
            },
        ],
        "backrefs": [
            {
                "img": "https://static.krcg.org/card/helicopter.jpg",
                "name": "Helicopter",
                "printed_name": "Helicopter",
                "uid": "100909",
            },
            {
                "img": "https://static.krcg.org/card/incriminatingvideotape.jpg",
                "name": "Incriminating Videotape",
                "printed_name": "Incriminating Videotape",
                "uid": "100972",
            },
            {
                "img": "https://static.krcg.org/card/mokoleblood.jpg",
                "name": "Mokolé Blood",
                "printed_name": "Mokolé Blood",
                "uid": "101232",
            },
            {
                "img": "https://static.krcg.org/card/shilmulotarot.jpg",
                "name": "Shilmulo Tarot",
                "printed_name": "Shilmulo Tarot",
                "uid": "101767",
            },
        ],
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
                "symbols": [],
                "uid": "100339",
            },
            {
                "img": "https://static.krcg.org/card/coma.jpg",
                "name": "Coma",
                "prefix": "[DEM]",
                "printed_name": "Coma",
                "symbols": [
                    {
                        "text": "[DEM]",
                        "symbol": "E",
                    }
                ],
                "uid": "100378",
            },
            {
                "img": "https://static.krcg.org/card/derange.jpg",
                "name": "Derange",
                "prefix": "",
                "printed_name": "Derange",
                "symbols": [],
                "uid": "100527",
            },
            {
                "img": "https://static.krcg.org/card/detection.jpg",
                "name": "Detection",
                "prefix": "",
                "printed_name": "Detection",
                "symbols": [],
                "uid": "100533",
            },
            {
                "img": "https://static.krcg.org/card/faeriewards.jpg",
                "name": "Faerie Wards",
                "prefix": "[MYT]",
                "printed_name": "Faerie Wards",
                "symbols": [
                    {
                        "text": "[MYT]",
                        "symbol": "X",
                    }
                ],
                "uid": "100690",
            },
            {
                "img": "https://static.krcg.org/card/fantasyworld.jpg",
                "name": "Fantasy World",
                "prefix": "",
                "printed_name": "Fantasy World",
                "symbols": [],
                "uid": "100701",
            },
            {
                "img": "https://static.krcg.org/card/flashgrenade.jpg",
                "name": "Flash Grenade",
                "prefix": "",
                "printed_name": "Flash Grenade",
                "symbols": [],
                "uid": "100745",
            },
            {
                "img": "https://static.krcg.org/card/lextalionis.jpg",
                "name": "Lextalionis",
                "prefix": "",
                "printed_name": "Lextalionis",
                "symbols": [],
                "uid": "101099",
            },
            {
                "img": "https://static.krcg.org/card/libertyclubintrigue.jpg",
                "name": "Liberty Club Intrigue",
                "prefix": "",
                "printed_name": "Liberty Club Intrigue",
                "symbols": [],
                "uid": "101101",
            },
            {
                "img": "https://static.krcg.org/card/mindnumb.jpg",
                "name": "Mind Numb",
                "prefix": "",
                "printed_name": "Mind Numb",
                "symbols": [],
                "uid": "101211",
            },
            {
                "img": "https://static.krcg.org/card/mindrape.jpg",
                "name": "Mind Rape",
                "prefix": "",
                "printed_name": "Mind Rape",
                "symbols": [],
                "uid": "101215",
            },
            {
                "img": "https://static.krcg.org/card/mummystongue.jpg",
                "name": "Mummy's Tongue",
                "prefix": "",
                "printed_name": "Mummy's Tongue",
                "symbols": [],
                "uid": "101252",
            },
            {
                "img": "https://static.krcg.org/card/rotschreck.jpg",
                "name": "Rötschreck",
                "prefix": "",
                "printed_name": "Rötschreck",
                "symbols": [],
                "uid": "101654",
            },
            {
                "img": "https://static.krcg.org/card/rowanring.jpg",
                "name": "Rowan Ring",
                "prefix": "",
                "printed_name": "Rowan Ring",
                "symbols": [],
                "uid": "101655",
            },
            {
                "img": "https://static.krcg.org/card/sensorydeprivation.jpg",
                "name": "Sensory Deprivation",
                "prefix": "",
                "printed_name": "Sensory Deprivation",
                "symbols": [],
                "uid": "101721",
            },
            {
                "img": "https://static.krcg.org/card/serpentsnumbingkiss.jpg",
                "name": "Serpent's Numbing Kiss",
                "prefix": "[PRE][SER]",
                "printed_name": "Serpent's Numbing Kiss",
                "symbols": [
                    {"text": "[PRE]", "symbol": "R"},
                    {
                        "text": "[SER]",
                        "symbol": "S",
                    },
                ],
                "uid": "101727",
            },
            {
                "img": "https://static.krcg.org/card/shacklesofenkidu.jpg",
                "name": "Shackles of Enkidu",
                "prefix": "",
                "printed_name": "Shackles of Enkidu",
                "symbols": [],
                "uid": "101733",
            },
            {
                "img": "https://static.krcg.org/card/sheepdog.jpg",
                "name": "Sheepdog",
                "prefix": "",
                "printed_name": "Sheepdog",
                "symbols": [],
                "uid": "101762",
            },
            {
                "img": "https://static.krcg.org/card/snipehunt.jpg",
                "name": "Snipe Hunt",
                "prefix": "",
                "printed_name": "Snipe Hunt",
                "symbols": [],
                "uid": "101815",
            },
            {
                "img": "https://static.krcg.org/card/spikethrower.jpg",
                "name": "Spike-Thrower",
                "prefix": "",
                "printed_name": "Spike-Thrower",
                "symbols": [],
                "uid": "101846",
            },
            {
                "img": "https://static.krcg.org/card/toreadorgrandball.jpg",
                "name": "Toreador Grand Ball",
                "prefix": "",
                "printed_name": "Toreador Grand Ball",
                "symbols": [],
                "uid": "101989",
            },
            {
                "img": "https://static.krcg.org/card/visionquest.jpg",
                "name": "Visionquest",
                "prefix": "",
                "printed_name": "Visionquest",
                "symbols": [],
                "uid": "102125",
            },
            {
                "img": "https://static.krcg.org/card/woodenstake.jpg",
                "name": "Wooden Stake",
                "prefix": "",
                "printed_name": "Wooden Stake",
                "symbols": [],
                "uid": "102192",
            },
        ],
        "name": "Do Not Unlock as Normal",
        "rulings": [
            {
                "uid": "ELPPIZXU",
                "cards": [],
                "target": {"name": "Do Not Unlock as Normal", "uid": "G00008"},
                "references": [
                    {
                        "text": "[LSJ 20050114]",
                        "uid": "LSJ 20050114",
                        "source": "LSJ",
                        "date": "2005-01-14",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/JWiZmyC2Y6s/q6JHYrE1zKYJ"
                        ),
                    },
                ],
                "symbols": [],
                "text": (
                    'The "does not unlock as normal" effect is redundant with being '
                    "infernal. If the minion is infernal, his controller can still pay "
                    "a pool to unlock him. [LSJ 20050114]"
                ),
            },
        ],
        "uid": "G00008",
    }


def test_check_references(client):
    response = client.get("/check-references")
    assert response.status_code == 200
    assert response.json == []


def test_add_reference(client):
    response = client.post("/proposal")
    assert response.status_code == 200
    assert "proposal_id" in response.json

    response = client.post(
        "/reference",
        json={
            "uid": "LSJ 20001225",
            "url": "https://groups.google.com/g/rec.games.trading-cards.jyhad/test",
        },
    )
    assert response.status_code == 200
    assert response.json == {
        "uid": "LSJ 20001225",
        "url": "https://groups.google.com/g/rec.games.trading-cards.jyhad/test",
        "date": "2000-12-25",
        "source": "LSJ",
    }


def test_delete_reference(client):
    response = client.post("/proposal")
    assert response.status_code == 200
    assert "proposal_id" in response.json
    response = client.delete("/reference/ANK%2020170105")
    assert response.status_code == 200
    assert response.json == {}
    # the ruling reference is still used and appears in answers
    # until the modification is validated and merged
    response = client.get("/card/101309")
    assert response.status_code == 200
    assert response.json == {
        "blood_cost": None,
        "conviction_cost": None,
        "disciplines": ["dom"],
        "groups": [],
        "img": "https://static.krcg.org/card/obedience.jpg",
        "name": "Obedience",
        "pool_cost": None,
        "printed_name": "Obedience",
        "symbols": [
            {"symbol": "7", "text": "REACTION"},
            {"symbol": "d", "text": "dom"},
        ],
        "text": (
            "Only usable if this vampire is about to enter combat with an acting "
            "younger vampire.\n"
            "[dom] Unlock the acting vampire and end the action. (Do not lock this "
            "vampire if they are blocking.) The acting vampire cannot take the same "
            "action this turn.\n"
            "[DOM] As above, but do not unlock the acting vampire."
        ),
        "text_symbols": [
            {"symbol": "d", "text": "[dom]"},
            {"symbol": "D", "text": "[DOM]"},
        ],
        "types": ["REACTION"],
        "uid": "101309",
        "rulings": [
            {
                "cards": [],
                "uid": "3S5VPR5E",
                "references": [
                    {
                        "date": "2007-07-09",
                        "source": "LSJ",
                        "text": "[LSJ 20070709]",
                        "uid": "LSJ 20070709",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/qKrJPLXBFFw/hE5z511E_PgJ"
                        ),
                    },
                ],
                "symbols": [],
                "target": {"name": "Obedience", "uid": "101309"},
                "text": "The action has reached resolution, so is subject to NRA (Non "
                "Repeatable Action) rules. [LSJ 20070709]",
            },
            {
                "cards": [],
                "uid": "KH7YGTAT",
                "references": [
                    {
                        "date": "2006-05-22",
                        "source": "LSJ",
                        "text": "[LSJ 20060522]",
                        "uid": "LSJ 20060522",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/2f0wF9CECu8/SZn9iGo-LOQJ"
                        ),
                    },
                    {
                        "date": "2006-08-24",
                        "source": "LSJ",
                        "text": "[LSJ 20060824]",
                        "uid": "LSJ 20060824",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/zsZTYTbRVRI/VmMfnKWuMlMJ"
                        ),
                    },
                    {
                        "date": "2008-07-25",
                        "source": "LSJ",
                        "text": "[LSJ 20080725]",
                        "uid": "LSJ 20080725",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/jWWCwKnran0/6JxzHnKdJkkJ"
                        ),
                    },
                    {
                        "date": "2009-06-17",
                        "source": "LSJ",
                        "text": "[LSJ 20090617]",
                        "uid": "LSJ 20090617",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/OMTF0_ZqUL0/ijdnbYacuNkJ"
                        ),
                    },
                ],
                "symbols": [],
                "target": {"name": "Obedience", "uid": "101309"},
                "text": (
                    'Actions without card (provided by the rulebook) are not "the '
                    'same" as actions provided by cards (played or in play). [LSJ '
                    "20060522]  [LSJ 20060824] [LSJ 20080725] [LSJ 20090617]"
                ),
            },
            {
                "cards": [],
                "uid": "IJRZZBNK",
                "references": [
                    {
                        "date": "1995-05-09",
                        "source": "RTR",
                        "text": "[RTR 19950509]",
                        "uid": "RTR 19950509",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/_LKyR7pdMig/ZvwdGmIwUnsJ"
                        ),
                    },
                    {
                        "date": "2008-07-10",
                        "source": "LSJ",
                        "text": "[LSJ 20080710]",
                        "uid": "LSJ 20080710",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/f1NpGhdtk-E/MEbLGzSGessJ"
                        ),
                    },
                    {
                        "date": "2020-05-02",
                        "source": "ANK",
                        "text": "[ANK 20200502]",
                        "uid": "ANK 20200502",
                        "url": (
                            "http://www.vekn.net/forum/rules-questions/"
                            "78616-change-of-target-equip-from-a-minion#99734"
                        ),
                    },
                ],
                "symbols": [],
                "target": {"name": "Obedience", "uid": "101309"},
                "text": (
                    "Actions without card (provided by the rulebook) can be repeated "
                    "if they have different targets. Equipping from a minion targets "
                    "the equipments: if one equipment is the same, the action is the "
                    "same. [RTR 19950509] [LSJ 20080710] [ANK 20200502]"
                ),
            },
            {
                "cards": [],
                "uid": "B4XKE74K",
                "references": [
                    {
                        "date": "2008-07-25",
                        "source": "LSJ",
                        "text": "[LSJ 20080725]",
                        "uid": "LSJ 20080725",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/jWWCwKnran0/6JxzHnKdJkkJ"
                        ),
                    },
                ],
                "symbols": [],
                "target": {"name": "Obedience", "uid": "101309"},
                "text": (
                    "Actions provided by cards in play are not the same if the card is "
                    "not the same, even if the cards have the same name. [LSJ "
                    "20080725]"
                ),
            },
            {
                "cards": [],
                "uid": "7BY3OVIR",
                "references": [
                    {
                        "date": "1999-10-25",
                        "source": "LSJ",
                        "text": "[LSJ 19991025]",
                        "uid": "LSJ 19991025",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/R94tyTGJ6VQ/KxvkGm1aon8J"
                        ),
                    },
                ],
                "symbols": [],
                "target": {"name": "Obedience", "uid": "101309"},
                "text": (
                    "Can be played by an unlocked older vampire to avoid a new combat "
                    "queued after a preceding combat, if the opponent is still the "
                    "acting vampire. [LSJ 19991025]"
                ),
            },
            {
                "cards": [],
                "uid": "RKZQ32S7",
                "references": [
                    {
                        "date": "2018-07-19",
                        "source": "RTR",
                        "text": "[RTR 20180719]",
                        "uid": "RTR 20180719",
                        "url": (
                            "https://www.blackchantry.com/2018/07/18/"
                            "rules-team-rulings-rtr-19-07-2018/"
                        ),
                    },
                    {
                        "date": "2017-01-05",
                        "source": "ANK",
                        "text": "[ANK 20170105]",
                        "uid": "ANK 20170105",
                        "url": (
                            "http://www.vekn.net/forum/rules-questions/"
                            "75512-raptor-obedience#80020"
                        ),
                    },
                    {
                        "date": "2020-02-07",
                        "source": "ANK",
                        "text": "[ANK 20200207]",
                        "uid": "ANK 20200207",
                        "url": (
                            "http://www.vekn.net/forum/rules-questions/"
                            "78423-mental-maze-and-obedience#98906"
                        ),
                    },
                ],
                "symbols": [],
                "target": {"name": "Obedience", "uid": "101309"},
                "text": (
                    "The action ends unsuccessfully immediately, combat does not "
                    "happen, no other action modifier or reaction can be played "
                    "afterwards. [RTR 20180719] [ANK 20170105] [ANK 20200207]"
                ),
            },
            {
                "cards": [],
                "uid": "YN3DPPRD",
                "references": [
                    {
                        "date": "2017-12-12",
                        "source": "ANK",
                        "text": "[ANK 20171212]",
                        "uid": "ANK 20171212",
                        "url": (
                            "http://www.vekn.net/forum/rules-questions/"
                            "76334-slave-mental-maze-interaction?start=12#84553"
                        ),
                    },
                ],
                "symbols": [],
                "target": {
                    "name": "Obedience",
                    "uid": "101309",
                },
                "text": (
                    "Cannot be played if the opponent is not the acting vampire, for "
                    "example if a slave took his place. [ANK 20171212]"
                ),
            },
        ],
        "backrefs": [
            {
                "img": "https://static.krcg.org/card/achingbeauty.jpg",
                "name": "Aching Beauty",
                "printed_name": "Aching Beauty",
                "uid": "100018",
            },
            {
                "img": "https://static.krcg.org/card/cryptssons.jpg",
                "name": "Crypt's Sons",
                "printed_name": "Crypt's Sons",
                "uid": "100476",
            },
            {
                "img": "https://static.krcg.org/card/deepsong.jpg",
                "name": "Deep Song",
                "printed_name": "Deep Song",
                "uid": "100515",
            },
            {
                "img": "https://static.krcg.org/card/mariepierreg6.jpg",
                "name": "Marie-Pierre (G6)",
                "printed_name": "Marie-Pierre",
                "uid": "200928",
            },
        ],
    }
    # but it will show errors when checking references
    response = client.get("/check-references")
    assert response.status_code == 200
    assert response.json == [
        "101309|Obedience ruling #RKZQ32S7 has invalid reference(s): {'ANK 20170105'}",
    ]


def test_add_card_ruling(client):
    response = client.post("/proposal")
    assert response.status_code == 200
    # Using an unknown reference will raise an error
    response = client.post(
        "/ruling/100015", json={"text": "Non-existing reference [ANK 20210101]"}
    )
    assert response.status_code == 400
    assert response.json == ["Unknown reference ANK 20210101"]
    # A real reference will work
    response = client.post(
        "/ruling/100015", json={"text": "Test ruling [RTR 20070707]"}
    )
    assert response.status_code == 200
    assert response.json == {
        "cards": [],
        "uid": "NBGBNBDU",
        "references": [
            {
                "date": "2007-07-07",
                "source": "RTR",
                "text": "[RTR 20070707]",
                "uid": "RTR 20070707",
                "url": (
                    "https://groups.google.com/d/msg/rec.games.trading-cards.jyhad/"
                    "vSOt2c1uRzQ/MsRAv47Cd4YJ"
                ),
            },
        ],
        "symbols": [],
        "target": {"name": "Academic Hunting Ground", "uid": "100015"},
        "text": "Test ruling [RTR 20070707]",
    }
    # the ruling reference appears in answers while the proposal is active
    response = client.get("/card/100015")
    assert response.status_code == 200
    assert response.json == {
        "backrefs": [],
        "blood_cost": None,
        "conviction_cost": None,
        "disciplines": [],
        "groups": [],
        "img": "https://static.krcg.org/card/academichuntingground.jpg",
        "name": "Academic Hunting Ground",
        "pool_cost": "2",
        "printed_name": "Academic Hunting Ground",
        "rulings": [
            {
                "cards": [],
                "uid": "NBGBNBDU",
                "references": [
                    {
                        "date": "2007-07-07",
                        "source": "RTR",
                        "text": "[RTR 20070707]",
                        "uid": "RTR 20070707",
                        "url": (
                            "https://groups.google.com/d/msg/"
                            "rec.games.trading-cards.jyhad/vSOt2c1uRzQ/MsRAv47Cd4YJ"
                        ),
                    },
                ],
                "symbols": [],
                "target": {"name": "Academic Hunting Ground", "uid": "100015"},
                "text": "Test ruling [RTR 20070707]",
            },
        ],
        "symbols": [],
        "text": (
            "Unique location. Hunting ground.\n"
            "During your unlock phase, a ready vampire you control can gain 1 blood. A "
            "vampire can gain blood from only one hunting ground each turn."
        ),
        "text_symbols": [],
        "types": ["MASTER"],
        "uid": "100015",
    }


def test_add_card_ruling_with_reference(client):
    response = client.post("/proposal")
    assert response.status_code == 200
    # Using an unknown reference will raise an error
    response = client.post(
        "/ruling/100015", json={"text": "Non-existing reference [ANK 20210101]"}
    )
    assert response.status_code == 400
    assert response.json == ["Unknown reference ANK 20210101"]
    # Adding the reference first works
    response = client.post(
        "/reference",
        json={
            "uid": "ANK 20210101",
            "url": "http://www.vekn.net/forum/rules-questions/test",
        },
    )
    assert response.status_code == 200
    response = client.post(
        "/ruling/100015", json={"text": "Non-existing reference [ANK 20210101]"}
    )
    assert response.status_code == 200
    assert response.json == {
        "cards": [],
        "uid": "FNEB7QCO",
        "references": [
            {
                "date": "2021-01-01",
                "source": "ANK",
                "text": "[ANK 20210101]",
                "uid": "ANK 20210101",
                "url": "http://www.vekn.net/forum/rules-questions/test",
            },
        ],
        "symbols": [],
        "target": {
            "name": "Academic Hunting Ground",
            "uid": "100015",
        },
        "text": "Non-existing reference [ANK 20210101]",
    }


def test_update_card_ruling(client):
    # 419 Operation has one ruling
    response = client.get("/card/100002")
    assert response.status_code == 200
    assert response.json == {
        "backrefs": [],
        "blood_cost": None,
        "conviction_cost": None,
        "disciplines": [],
        "groups": [],
        "img": "https://static.krcg.org/card/419operation.jpg",
        "name": "419 Operation",
        "pool_cost": None,
        "printed_name": "419 Operation",
        "rulings": [
            {
                "cards": [],
                "uid": "KRO5H6MD",
                "references": [
                    {
                        "date": "2022-10-11",
                        "source": "ANK",
                        "text": "[ANK 20221011-3]",
                        "uid": "ANK 20221011-3",
                        "url": (
                            "https://www.vekn.net/forum/rules-questions/"
                            "74643-419-operation-with-no-counters#106539"
                        ),
                    },
                ],
                "symbols": [],
                "target": {"name": "419 Operation", "uid": "100002"},
                "text": (
                    "You can burn the edge to burn the card if it has no counter. [ANK "
                    "20221011-3]"
                ),
            },
        ],
        "symbols": [
            {"symbol": "0", "text": "ACTION"},
        ],
        "text": (
            "+1 stealth action.\n"
            "Put this card in play. During your unlock phase, you may move 1 pool from "
            "your prey's pool to this card or move the pool on this card to your pool. "
            "Your prey can burn the Edge to move the counters on this card to his or "
            "her pool and burn this card."
        ),
        "text_symbols": [],
        "types": ["ACTION"],
        "uid": "100002",
    }
    # Let's change it
    response = client.post("/proposal")
    assert response.status_code == 200
    response = client.put(
        "/ruling/100002/KRO5H6MD",
        json={"text": "New wording! [ANK 20221011-3]"},
    )
    assert response.status_code == 200
    assert response.json == {
        "cards": [],
        "uid": "Z4MKBXPU",
        "references": [
            {
                "date": "2022-10-11",
                "source": "ANK",
                "text": "[ANK 20221011-3]",
                "uid": "ANK 20221011-3",
                "url": (
                    "https://www.vekn.net/forum/rules-questions/"
                    "74643-419-operation-with-no-counters#106539"
                ),
            },
        ],
        "symbols": [],
        "target": {"name": "419 Operation", "uid": "100002"},
        "text": "New wording! [ANK 20221011-3]",
    }


def test_delete_card_ruling(client):
    # Let's remove the ruling on 419 Operation
    response = client.post("/proposal")
    assert response.status_code == 200
    response = client.delete("/ruling/100002/KRO5H6MD")
    assert response.status_code == 200
    response = client.get("/card/100002")
    assert response.status_code == 200
    assert response.json == {
        "backrefs": [],
        "blood_cost": None,
        "conviction_cost": None,
        "disciplines": [],
        "groups": [],
        "img": "https://static.krcg.org/card/419operation.jpg",
        "name": "419 Operation",
        "pool_cost": None,
        "printed_name": "419 Operation",
        "rulings": [],
        "symbols": [{"symbol": "0", "text": "ACTION"}],
        "text": (
            "+1 stealth action.\n"
            "Put this card in play. During your unlock phase, you may move 1 pool from "
            "your prey's pool to this card or move the pool on this card to your pool. "
            "Your prey can burn the Edge to move the counters on this card to his or "
            "her pool and burn this card."
        ),
        "text_symbols": [],
        "types": ["ACTION"],
        "uid": "100002",
    }


def test_add_group_ruling(client):
    response = client.post("/proposal")
    assert response.status_code == 200
    response = client.post(
        "/ruling/G00008", json={"text": "Test ruling [RTR 20070707]"}
    )
    assert response.status_code == 200
    assert response.json == {
        "cards": [],
        "uid": "NBGBNBDU",
        "references": [
            {
                "date": "2007-07-07",
                "source": "RTR",
                "text": "[RTR 20070707]",
                "uid": "RTR 20070707",
                "url": (
                    "https://groups.google.com/d/msg/rec.games.trading-cards.jyhad/"
                    "vSOt2c1uRzQ/MsRAv47Cd4YJ"
                ),
            },
        ],
        "symbols": [],
        "target": {"name": "Do Not Unlock as Normal", "uid": "G00008"},
        "text": "Test ruling [RTR 20070707]",
    }
    # the ruling reference appears in answers while the proposal is active
    response = client.get("/group/G00008")
    assert response.status_code == 200
    assert response.json["rulings"] == [
        {
            "cards": [],
            "references": [
                {
                    "date": "2005-01-14",
                    "source": "LSJ",
                    "text": "[LSJ 20050114]",
                    "uid": "LSJ 20050114",
                    "url": (
                        "https://groups.google.com/d/msg/"
                        "rec.games.trading-cards.jyhad/JWiZmyC2Y6s/q6JHYrE1zKYJ"
                    ),
                },
            ],
            "symbols": [],
            "target": {"name": "Do Not Unlock as Normal", "uid": "G00008"},
            "text": 'The "does not unlock as normal" effect is redundant with being '
            "infernal. If the minion is infernal, his controller can still pay a "
            "pool to unlock him. [LSJ 20050114]",
            "uid": "ELPPIZXU",
        },
        {
            "cards": [],
            "references": [
                {
                    "date": "2007-07-07",
                    "source": "RTR",
                    "text": "[RTR 20070707]",
                    "uid": "RTR 20070707",
                    "url": (
                        "https://groups.google.com/d/msg/"
                        "rec.games.trading-cards.jyhad/vSOt2c1uRzQ/MsRAv47Cd4YJ"
                    ),
                },
            ],
            "symbols": [],
            "target": {"name": "Do Not Unlock as Normal", "uid": "G00008"},
            "text": "Test ruling [RTR 20070707]",
            "uid": "NBGBNBDU",
        },
    ]


def test_add_group(client):
    response = client.post("/proposal")
    assert response.status_code == 200
    response = client.post(
        "/group",
        json={
            "name": "Anti-combat cards",
            "cards": {
                "101201": "",
                "101223": "THA",
                "101309": "",
            },
        },
    )
    assert response.status_code == 200
    assert response.json == {
        "cards": [
            {
                "img": "https://static.krcg.org/card/mentalmaze.jpg",
                "name": "Mental Maze",
                "prefix": "",
                "printed_name": "Mental Maze",
                "symbols": [],
                "uid": "101201",
            },
            {
                "img": "https://static.krcg.org/card/mirrorwalk.jpg",
                "name": "Mirror Walk",
                "prefix": "THA",
                "printed_name": "Mirror Walk",
                "symbols": [],
                "uid": "101223",
            },
            {
                "img": "https://static.krcg.org/card/obedience.jpg",
                "name": "Obedience",
                "prefix": "",
                "printed_name": "Obedience",
                "symbols": [],
                "uid": "101309",
            },
        ],
        "name": "Anti-combat cards",
        "uid": "PFTD2UQWO",
    }
    # The new group also shows on the card
    response = client.get("/card/101201")
    assert response.json["groups"] == [
        {
            "name": "Anti-combat cards",
            "prefix": "",
            "symbols": [],
            "uid": "PFTD2UQWO",
        },
    ]


def test_update_group(client):
    response = client.post("/proposal")
    assert response.status_code == 200
    response = client.put(
        "/group/G00005",
        json={
            "cards": {
                "200094": "",
                "201052": "",
                "101309": "[DOM]",
            }
        },
    )
    assert response.status_code == 200
    assert response.json == {
        "cards": [
            {
                "img": "https://static.krcg.org/card/obedience.jpg",
                "name": "Obedience",
                "prefix": "[DOM]",
                "printed_name": "Obedience",
                "symbols": [{"symbol": "D", "text": "[DOM]"}],
                "uid": "101309",
            },
            {
                "img": "https://static.krcg.org/card/angelog3.jpg",
                "name": "Angelo (G3)",
                "prefix": "",
                "printed_name": "Angelo",
                "symbols": [],
                "uid": "200094",
            },
            {
                "img": "https://static.krcg.org/card/newbloodany.jpg",
                "name": "New Blood (ANY)",
                "prefix": "",
                "printed_name": "New Blood",
                "symbols": [],
                "uid": "201052",
            },
        ],
        "name": "Can Take any Circle",
        "uid": "G00005",
    }
    # The new group also shows on the card
    response = client.get("/card/101309")
    assert response.json["groups"] == [
        {
            "name": "Can Take any Circle",
            "prefix": "[DOM]",
            "symbols": [{"symbol": "D", "text": "[DOM]"}],
            "uid": "G00005",
        },
    ]
    # As its rulings
    assert (
        len([r for r in response.json["rulings"] if r["target"]["uid"] == "G00005"]) > 0
    )


def test_delete_group(client):
    response = client.post("/proposal")
    assert response.status_code == 200
    response = client.delete("/group/G00005")
    assert response.status_code == 200
    # group does not show anymore on cards
    response = client.get("/card/200094")
    assert response.json["groups"] == [
        {
            "name": "Use the Circle concept",
            "prefix": "",
            "symbols": [],
            "uid": "G00003",
        },
    ]
    # neither do group rulings
    for r in response.json["rulings"]:
        assert r["target"]["uid"] != "G00005"
