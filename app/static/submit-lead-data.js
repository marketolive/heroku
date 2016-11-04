var domain = "na-sjdemo1.marketo.com",
subId = 20,
mktoLiveLandingPageHost = "na-sjdemo1.marketo.com",
mktoLiveDevMunchkinId = "685-BTN-772",
mktoLiveProdMunchkinId = "185-NGX-811",
mktoLiveMunchkinId = mktoLiveDevMunchkinId,
mktoReferrer = "http%3A%2F%2Fwww.marketolive.com",
reqStaticParams = "&subId="+subId+"&munchkinId="+mktoLiveMunchkinId+"&_mktoReferrer="+mktoReferrer,
abmLeads,
abmUrls,
mockLeads,
webPages;

abmLeads = [{
        hash : "e91fea75734eeee375a1c0ad4c14bb16703aa0d0",
        email : "mktodemosvcs+1130@gmail.com"
    }, {
        hash : "3740cb0137c946959027f48be1b62df72601243f",
        email : "mktodemosvcs+1131@gmail.com"
    }, {
        hash : "9f8c199f279e7fc954b62a8484ee3584f3419e6c",
        email : "mktodemosvcs+1136@gmail.com"
    }, {
        hash : "d03c98a512f7aa85e794f8867bd6d1aac37ea3ce",
        email : "mktodemosvcs+1097@gmail.com"
    }, {
        hash : "adc6481dba82149a69c2165ada11c3116e72c3a1",
        email : "mktodemosvcs+1085@gmail.com"
    }, {
        hash : "149bca301f1f5f2b0d4b9e1d0c65e05072a6dd2b",
        email : "mktodemosvcs+1108@gmail.com"
    }, {
        hash : "613ac7814a7b133b4c48cd08c28dcdb2925c6c90",
        email : "mktodemosvcs+1089@gmail.com"
    }, {
        hash : "c8c630d55b53eb1ef5e9d70596ad8036de4983bc",
        email : "mktodemosvcs+1120@gmail.com"
    }, {
        hash : "c15265d94b1d17ba6e1bdb70a51fb926523ccc0b",
        email : "mktodemosvcs+1123@gmail.com"
    }, {
        hash : "1bfa2fcecb9fea94d8263e1d1d833720145e4d15",
        email : "mktodemosvcs+1126@gmail.com"
    }, {
        hash : "18bd935f7f0e497eb8689a515aadaf066fd839a9",
        email : "mktodemosvcs+1129@gmail.com"
    }, {
        hash : "a9da34ec14ea5ddd33ac147fa1ae42e74022b099",
        email : "mktodemosvcs+1143@gmail.com"
    }, {
        hash : "31adac9d23710b02b6746b6fdf65d52d85595401",
        email : "mktodemosvcs+1152@gmail.com"
    }, {
        hash : "9452440a23f294ea5879d0882a9d1858d5fe23e8",
        email : "mktodemosvcs+1158@gmail.com"
    }, {
        hash : "e141b50b825f3f2fe89adcf1d267bb8b520965c2",
        email : "mktodemosvcs+1161@gmail.com"
    }, {
        hash : "6093a7828db75e5c89316d69d6f78304cc88dbe3",
        email : "mktodemosvcs+1162@gmail.com"
    }, {
        hash : "f5bbd3a31d25b6e84c0e2a4d50822d3ac06cd43c",
        email : "mktodemosvcs+1163@gmail.com"
    }, {
        hash : "15796656549a867967c3a7d805bfa4ff81abb63e",
        email : "mktodemosvcs+1165@gmail.com"
    }, {
        hash : "a60a39bd29412b6bf90334aea8150fcdf8eff7fc",
        email : "mktodemosvcs+1168@gmail.com"
    }, {
        hash : "c168a871d48c7fdcc4262a658e3a203cc6185acd",
        email : "mktodemosvcs+1171@gmail.com"
    }, {
        hash : "aa6d5d20f3c519591fc1c7d1362541839193aa48",
        email : "mktodemosvcs+1174@gmail.com"
    }, {
        hash : "40947ef64bbae81440db66167ba291e88465ff3d",
        email : "mktodemosvcs+1176@gmail.com"
    }, {
        hash : "c61c6110cf3c700954d180b17a59f4ab4a7dac13",
        email : "mktodemosvcs+1186@gmail.com"
    }, {
        hash : "8afce39e2b5c0a1186fae50deef75e946630fe49",
        email : "mktodemosvcs+1201@gmail.com"
    }, {
        hash : "5aff8c0a10d48b552356b0227f54b92e186acfd9",
        email : "mktodemosvcs+1111@gmail.com"
    }, {
        hash : "f22535c8370f54e0fa905994eb417251a8770157",
        email : "mktodemosvcs+1003@gmail.com"
    }, {
        hash : "aec5288554070e6f3c8ce0cebd8644921075c657",
        email : "mktodemosvcs+1004@gmail.com"
    }, {
        hash : "1e989d2ad20e2d9d805cd9a5de6fbef897f558a3",
        email : "mktodemosvcs+1026@gmail.com"
    }, {
        hash : "943f97052e9e9a4097ec4067e2dbdf5385d6fcc6",
        email : "mktodemosvcs+1030@gmail.com"
    }, {
        hash : "f83e490e0afaa225b4c2ad9635c08e13566b93fa",
        email : "mktodemosvcs+1015@gmail.com"
    }, {
        hash : "7d778f0382a3b6af7fe88d59a72f457a69aadf19",
        email : "mktodemosvcs+1033@gmail.com"
    }, {
        hash : "d0d22487953e23079101fe20cf69c203283269a9",
        email : "mktodemosvcs+1017@gmail.com"
    }, {
        hash : "986dcdc0cb373ce6a4c34197ac252888fa972aca",
        email : "mktodemosvcs+1023@gmail.com"
    }, {
        hash : "2a021465cdb28fe05bf040a197c38ddfab311e9d",
        email : "mktodemosvcs+1063@gmail.com"
    }, {
        hash : "263073da8924a478d5830e9d11775acc119904ee",
        email : "mktodemosvcs+1049@gmail.com"
    }, {
        hash : "9c9f0b35bddd67829061ef9d6eb212533acb40ef",
        email : "mktodemosvcs+1051@gmail.com"
    }, {
        hash : "ec8d7ae3997645f433a8871329ca046ea1d63da5",
        email : "mktodemosvcs+1064@gmail.com"
    }, {
        hash : "faf4437854a6a407efd1b6c0918eaca8e9d74e37",
        email : "mktodemosvcs+1065@gmail.com"
    }, {
        hash : "f1321fad25976853bc17ba104bec26e4493160ee",
        email : "mktodemosvcs+1052@gmail.com"
    }, {
        hash : "c48b843a94dec02cbd2d32a94cc5529348801b03",
        email : "mktodemosvcs+1053@gmail.com"
    }, {
        hash : "7818513548f186fd5d9a7b8d38b04e523d6c3330",
        email : "mktodemosvcs+1071@gmail.com"
    }, {
        hash : "74b980349c99f67073adebdd587c4fb5b05c1a13",
        email : "mktodemosvcs+1054@gmail.com"
    }, {
        hash : "9115eea975e011ecc02c594db5c2f92211936093",
        email : "mktodemosvcs+1055@gmail.com"
    }, {
        hash : "5093d33e1198278f96c4df0f17ebd43753386c7b",
        email : "mktodemosvcs+1078@gmail.com"
    }, {
        hash : "476c666881d7bf07553ec6231d1a684e06f51b6c",
        email : "mktodemosvcs+1079@gmail.com"
    }, {
        hash : "ae96530598ad0183ecbcdd1be486f4d3f091babc",
        email : "mktodemosvcs+1080@gmail.com"
    }, {
        hash : "5697a19bc2453f736f9b59ef4acbeca01d1e0427",
        email : "mktodemosvcs+1056@gmail.com"
    }, {
        hash : "25cc3abbb9e0eacd4a915b69255692212a5ba5c3",
        email : "mktodemosvcs+1043@gmail.com"
    }, {
        hash : "1613c5406135f957ec407abb1ab76ed4e9ddc6a7",
        email : "mktodemosvcs+jphandson@gmail.com"
    }];

abmUrls = [
    "/are-you-abm-ready.html",
    "/top5-abm-themes.html",
    "/marketers-can-benefit-from-abm.html",
    "/sirius-abm-2016-state.html",
    "/account-based-nurturing.html",
    "/get-it-right-with-abm.html",
    "/blog/accelerate-your-sales.html",
    "/solutions/lead-management.html",
    "/solutions/abm.html",
    "/blog/digital-marketing-financial",
    "/top5-digital-engagement-themes.html",
    "/reboot-europe-tech-industry.html"
];

mockLeads = [{
  "num": 1,
  "firstName": "Victor",
  "lastName": "Johnston",
  "email": "mktodemosvcs+1@gmail.com",
  "hash": "a664c966bd39c50a33712a109b1e1d7264964ffd",
  "jobTitle": "Vice President, Sales Engineering",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Webinar",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 2,
  "firstName": "Robert",
  "lastName": "Hamilton",
  "email": "mktodemosvcs+2@gmail.com",
  "hash": "59bfa8517eda99c7cedf08cf6140aac00ef7963a",
  "jobTitle": "Vice President, Sales Engineering",
  "company": "Turner Technologies",
  "industry": "Technology",
  "leadSource": "PPC",
  "mobileNumber": null,
  "phoneNumber": "+1-989-555-6447"
}, {
  "num": 3,
  "firstName": "Gloria",
  "lastName": "Stewart",
  "email": "mktodemosvcs+3@gmail.com",
  "hash": "36aeb37c41803408fba11882df5df9d3aa49e164",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-985-555-8565"
}, {
  "num": 4,
  "firstName": "Cheryl",
  "lastName": "Roberts",
  "email": "mktodemosvcs+4@gmail.com",
  "hash": "8563403e2af6fe9ed0d792b29126ce68bc67b53c",
  "jobTitle": "Web Marketing Manager",
  "company": "Travel4Life",
  "industry": "Travel & Leisure",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 5,
  "firstName": "Christopher",
  "lastName": "Lewis",
  "email": "mktodemosvcs+5@gmail.com",
  "hash": "edc1d7b787fe3fae7c08366c3dc9b18a2832cf6e",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-989-555-5561"
}, {
  "num": 6,
  "firstName": "John",
  "lastName": "Romero",
  "email": "mktodemosvcs+6@gmail.com",
  "hash": "3d69c776af8873f45818431d98b22902503b81cf",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Webinar",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 7,
  "firstName": "Ann",
  "lastName": "Thompson",
  "email": "mktodemosvcs+7@gmail.com",
  "hash": "640096c73bb803efbc5a2d20b132aba6029e4591",
  "jobTitle": "Vice President",
  "company": "Turner Technologies",
  "industry": "Technology",
  "leadSource": "Website",
  "mobileNumber": "+1-989-555-9903",
  "phoneNumber": null
}, {
  "num": 8,
  "firstName": "Katherine",
  "lastName": "Bishop",
  "email": "mktodemosvcs+8@gmail.com",
  "hash": "e34ffa160cb5d6ce3588442ed096bbae4cd7385b",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Travel4Life",
  "industry": "Travel & Leisure",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 9,
  "firstName": "Peter",
  "lastName": "Weaver",
  "email": "mktodemosvcs+9@gmail.com",
  "hash": "35441f30bf51e6f054926de957429da8a36e3db5",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Turner Technologies",
  "industry": "Technology",
  "leadSource": "Website",
  "mobileNumber": "+1-985-555-0145",
  "phoneNumber": "+1-984-555-0823"
}, {
  "num": 10,
  "firstName": "Daniel",
  "lastName": "Hughes",
  "email": "mktodemosvcs+10@gmail.com",
  "hash": "8db81bfd25919152ea3c24fdc4553be7e9a891bc",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 11,
  "firstName": "Louis",
  "lastName": "Gonzalez",
  "email": "mktodemosvcs+11@gmail.com",
  "hash": "231c642c859ab966f78d869dfa1b975f89611f1a",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Website",
  "mobileNumber": "+1-989-555-8724",
  "phoneNumber": "+1-984-555-4557"
}, {
  "num": 12,
  "firstName": "Johnny",
  "lastName": "Richards",
  "email": "mktodemosvcs+12@gmail.com",
  "hash": "17877a1c082a5b6dd79645956569711595da7678",
  "jobTitle": "Vice President, Sales Engineering",
  "company": "Travel4Life",
  "industry": "Travel & Leisure",
  "leadSource": "Webinar",
  "mobileNumber": "+1-949-555-2453",
  "phoneNumber": null
}, {
  "num": 13,
  "firstName": "Eugene",
  "lastName": "West",
  "email": "mktodemosvcs+13@gmail.com",
  "hash": "6c262511300130728e15258a59cbe77e099fe11b",
  "jobTitle": "Vice President, Sales Engineering",
  "company": "Turner Technologies",
  "industry": "Technology",
  "leadSource": "Referral",
  "mobileNumber": "+1-989-555-9648",
  "phoneNumber": null
}, {
  "num": 14,
  "firstName": "Sandra",
  "lastName": "Torres",
  "email": "mktodemosvcs+14@gmail.com",
  "hash": "16f393e89a8c4177ef3a7a70724e60217d7cee5e",
  "jobTitle": "Vice President, Marketing",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-989-555-0381"
}, {
  "num": 15,
  "firstName": "Justin",
  "lastName": "Hart",
  "email": "mktodemosvcs+15@gmail.com",
  "hash": "baa67edfd55a0ba22f6856f2f885825abe02a0e9",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Referral",
  "mobileNumber": "+1-989-555-4072",
  "phoneNumber": null
}, {
  "num": 16,
  "firstName": "Ryan",
  "lastName": "Marshall",
  "email": "mktodemosvcs+16@gmail.com",
  "hash": "26d1eae8ed1538ae9c5711a7685860c59e127340",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 17,
  "firstName": "Adam",
  "lastName": "Howell",
  "email": "mktodemosvcs+17@gmail.com",
  "hash": "8424d9f6010d2bceb37afc6b3a4427ac742fb726",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-985-555-0132"
}, {
  "num": 18,
  "firstName": "Joan",
  "lastName": "Alexander",
  "email": "mktodemosvcs+18@gmail.com",
  "hash": "3bf213736c6d1f903063deb077c6897b24e7350f",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-985-555-2502"
}, {
  "num": 19,
  "firstName": "Jane",
  "lastName": "Olson",
  "email": "mktodemosvcs+19@gmail.com",
  "hash": "2619a1877cf0280f0b5e93053095cd96a6e77a91",
  "jobTitle": "Vice President, Sales Engineering",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Sales Outbound",
  "mobileNumber": null,
  "phoneNumber": "+1-985-555-4114"
}, {
  "num": 20,
  "firstName": "Gregory",
  "lastName": "Green",
  "email": "mktodemosvcs+20@gmail.com",
  "hash": "4fdd9d953fa97c178073c73d7ecb68fd824bd697",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": "+1-985-555-3027",
  "phoneNumber": "+1-985-555-2536"
}, {
  "num": 21,
  "firstName": "Johnny",
  "lastName": "Smith",
  "email": "mktodemosvcs+21@gmail.com",
  "hash": "57348acf737dc7aa84d3586a3140b5a4caebd722",
  "jobTitle": "Web Marketing Manager",
  "company": "Turner Technologies",
  "industry": "Technology",
  "leadSource": "Online Ad",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 22,
  "firstName": "Carolyn",
  "lastName": "Wagner",
  "email": "mktodemosvcs+22@gmail.com",
  "hash": "83c4f24d753594cf55f7fb9f993cf97bfac90aaf",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Turner Technologies",
  "industry": "Technology",
  "leadSource": "Inbound Call",
  "mobileNumber": null,
  "phoneNumber": "+1-989-555-4088"
}, {
  "num": 23,
  "firstName": "Robert",
  "lastName": "Evans",
  "email": "mktodemosvcs+23@gmail.com",
  "hash": "20df456a8994a0edaedfa26f0e63007212f97d7e",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-985-555-0660"
}, {
  "num": 24,
  "firstName": "Phyllis",
  "lastName": "Nguyen",
  "email": "mktodemosvcs+24@gmail.com",
  "hash": "45a67e47647f5807454957b2b554ff6b7e3114dc",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Website",
  "mobileNumber": "+1-989-555-3464",
  "phoneNumber": "+1-989-555-8129"
}, {
  "num": 25,
  "firstName": "Martin",
  "lastName": "Bell",
  "email": "mktodemosvcs+25@gmail.com",
  "hash": "82a3fecdb55a6b32cc8b0a1f24e107b4c3680367",
  "jobTitle": "Vice President, Sales Engineering",
  "company": "Turner Technologies",
  "industry": "Technology",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-989-555-0178"
}, {
  "num": 26,
  "firstName": "Debra",
  "lastName": "Larson",
  "email": "mktodemosvcs+26@gmail.com",
  "hash": "66d783a08bb67a09d7702da8b5486ee2cd7afd1f",
  "jobTitle": "Web Marketing Manager",
  "company": "Luxury Escapes",
  "industry": "Travel & Leisure",
  "leadSource": "Webinar",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 27,
  "firstName": "Patricia",
  "lastName": "Dunn",
  "email": "mktodemosvcs+27@gmail.com",
  "hash": "2001ff6e8d9c3ee9882229dcb336125ec0cc032e",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Webinar",
  "mobileNumber": "+1-985-555-3751",
  "phoneNumber": null
}, {
  "num": 28,
  "firstName": "Ernest",
  "lastName": "Garrett",
  "email": "mktodemosvcs+28@gmail.com",
  "hash": "2600a14c001cbeb89849099e30a4d7822f1b0def",
  "jobTitle": "Web Marketing Manager",
  "company": "Turner Technologies",
  "industry": "Technology",
  "leadSource": "Webinar",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 29,
  "firstName": "Jerry",
  "lastName": "Montgomery",
  "email": "mktodemosvcs+29@gmail.com",
  "hash": "f1b6b1937f4e215536371fc9bfb28a470fde6604",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Sales Outbound",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 30,
  "firstName": "Debra",
  "lastName": "Gutierrez",
  "email": "mktodemosvcs+30@gmail.com",
  "hash": "bb042abdc989ff0d2ce7d8348c7b3a677c621e4b",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-980-555-6389"
}, {
  "num": 31,
  "firstName": "Lois",
  "lastName": "Kelley",
  "email": "mktodemosvcs+31@gmail.com",
  "hash": "938aed4c24bf0f3cc6300c0729d00873c7876572",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Sales Outbound",
  "mobileNumber": "+1-985-555-5641",
  "phoneNumber": "+1-985-555-2016"
}, {
  "num": 32,
  "firstName": "Anthony",
  "lastName": "Palmer",
  "email": "mktodemosvcs+32@gmail.com",
  "hash": "b4fdc37c37938aba7f123a58037c19c588c3e727",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-989-555-7292"
}, {
  "num": 33,
  "firstName": "Kathy",
  "lastName": "Murphy",
  "email": "mktodemosvcs+33@gmail.com",
  "hash": "f0967552e7d329214c8c9f6d62799a85bf296b0b",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "PPC",
  "mobileNumber": "+1-985-555-4958",
  "phoneNumber": null
}, {
  "num": 34,
  "firstName": "Harry",
  "lastName": "Kim",
  "email": "mktodemosvcs+34@gmail.com",
  "hash": "74608032ae2513ff77efe792847a71fafceadc7e",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": "+1-989-555-9612",
  "phoneNumber": "+1-985-555-0432"
}, {
  "num": 35,
  "firstName": "Clarence",
  "lastName": "Barnes",
  "email": "mktodemosvcs+35@gmail.com",
  "hash": "67bf365fe0956c67aec011db9090e4c41e827001",
  "jobTitle": "Web Marketing Manager",
  "company": "Travel4Life",
  "industry": "Travel & Leisure",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-989-555-0027"
}, {
  "num": 36,
  "firstName": "Eric",
  "lastName": "Campbell",
  "email": "mktodemosvcs+36@gmail.com",
  "hash": "15d19df0b33f3b020f9c06751376fa7b865e4b8e",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Referral",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 37,
  "firstName": "Patricia",
  "lastName": "Holmes",
  "email": "mktodemosvcs+37@gmail.com",
  "hash": "2bd3550d6f2236be7e8dfba03e3fb6121326ca04",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Webinar",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 38,
  "firstName": "Dorothy",
  "lastName": "Howell",
  "email": "mktodemosvcs+38@gmail.com",
  "hash": "cf13900ae8b4e152590b8ce27da2378adfac8d77",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 39,
  "firstName": "Heather",
  "lastName": "Weaver",
  "email": "mktodemosvcs+39@gmail.com",
  "hash": "d054cf77a2689d07245c1016bc2fdda61d5418be",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Sales Outbound",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 40,
  "firstName": "Terry",
  "lastName": "Powell",
  "email": "mktodemosvcs+40@gmail.com",
  "hash": "c0ce177d7c8810556d704470a6c55ea610084bed",
  "jobTitle": "Vice President, Sales Engineering",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-984-555-1833"
}, {
  "num": 41,
  "firstName": "Jacqueline",
  "lastName": "Kelly",
  "email": "mktodemosvcs+41@gmail.com",
  "hash": "02a6d98178052327f4b473e8537a655993a50aa4",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Website",
  "mobileNumber": "+1-985-555-1838",
  "phoneNumber": null
}, {
  "num": 42,
  "firstName": "Brian",
  "lastName": "Ramos",
  "email": "mktodemosvcs+42@gmail.com",
  "hash": "0f4d95c2859fabc59d93136a15c04fabbe5be5e9",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-984-555-0969"
}, {
  "num": 43,
  "firstName": "Arthur",
  "lastName": "Burke",
  "email": "mktodemosvcs+43@gmail.com",
  "hash": "c602794fc748965d57f6d7ceea787194fd5b61ee",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Webinar",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 44,
  "firstName": "Jeremy",
  "lastName": "Perkins",
  "email": "mktodemosvcs+44@gmail.com",
  "hash": "6512a3470bd32605ed2746d1cae2873f45205a4d",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Sales Outbound",
  "mobileNumber": null,
  "phoneNumber": "+1-984-555-4038"
}, {
  "num": 45,
  "firstName": "Lisa",
  "lastName": "Williamson",
  "email": "mktodemosvcs+45@gmail.com",
  "hash": "e04bccffae4be5aa59a702a259383203f8d81f1c",
  "jobTitle": "Web Marketing Manager",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Webinar",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 46,
  "firstName": "Kathy",
  "lastName": "Harris",
  "email": "mktodemosvcs+46@gmail.com",
  "hash": "a7352d59266694c88faa97403bb0671d23c9d6f9",
  "jobTitle": "Vice President, World Wide Marketing & Corporate Strategy",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": "+1-985-555-4762"
}, {
  "num": 47,
  "firstName": "Kelly",
  "lastName": "Ryan",
  "email": "mktodemosvcs+47@gmail.com",
  "hash": "3dde0848f5c347e458965dba6c538c1c75e64464",
  "jobTitle": "Web Marketing Manager",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Referral",
  "mobileNumber": null,
  "phoneNumber": "+1-984-555-9729"
}, {
  "num": 48,
  "firstName": "Scott",
  "lastName": "Lopez",
  "email": "bounce+1@gmail.com",
  "hash": "aa13415c3f822b90ed5eff12e927fc05ea73ec09",
  "jobTitle": "Vice President, Sales",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": null
}, {
  "num": 49,
  "firstName": "Eric",
  "lastName": "Robinson",
  "email": "bounce+2@gmail.com",
  "hash": "5dbfe3ec867f5b528ab689cf341a90eedf351b4d",
  "jobTitle": "Vice President, Marketing",
  "company": "University of Marketing",
  "industry": "Higher Education",
  "leadSource": "Website",
  "mobileNumber": "+1-985-555-1716",
  "phoneNumber": "+1-979-555-2367"
}, {
  "num": 50,
  "firstName": "Lawrence",
  "lastName": "Bryant",
  "email": "bounce+3@gmail.com",
  "hash": "974ee9ba6445c368dc4abbdf448b57c49927bb9e",
  "jobTitle": "Vice President, Sales",
  "company": "Utah Instruments",
  "industry": "Manufacturing",
  "leadSource": "Website",
  "mobileNumber": null,
  "phoneNumber": null
}];

webPages = [{
        urlPath : "/info/why-us",
        visitationRate : 0.33
    }, {
        urlPath : "/info/integrations",
        visitationRate : 0.50
    }, {
        urlPath : "/info/contact-us",
        visitationRate : 0.05
    }, {
        urlPath : "/info/live-event",
        visitationRate : 0.50
    }, {
        urlPath : "/info/webinar",
        visitationRate : 0.50
    }, {
        urlPath : "/info/products",
        visitationRate : 0.75
    }, {
        urlPath : "/info/pricing",
        visitationRate : 0.80
    }];

(function () {
    var didInit = false,
    s;
    
    function getCookie(cookieName) {
        console.log("Getting > Cookie: " + cookieName);
        
        var name = cookieName + '=',
        cookies = document.cookie.split(';'),
        currCookie;
        
        for (var ii = 0; ii < cookies.length; ii++) {
            currCookie = cookies[ii].trim();
            if (currCookie.indexOf(name) == 0) {
                return currCookie.substring(name.length, currCookie.length);
            }
        }
        console.log("Getting > Cookie: " + cookieName + " not found");
        return null;
    }
    
    function webRequest(method, url, async, username, password) {
        var xhr = new XMLHttpRequest();
        
        xhr.open(method, url, async, username, password);
        //xhr.responseType = "document";
        xhr.send();
        
        return xhr.statusText;
        //return xhr.response;
    }
    
    function resetMunchkinCookie() {
        if (getCookie("_mkto_trk")) {
            console.log("Removing > Cookie: _mkto_trk");
            document.cookie.replace(/;{0,1} {0,1}_mkto_trk=[^;]*/, "");
        }
        
        Munchkin.init(mktoLiveMunchkinId, {
            cookieLifeDays : 365,
            cookieAnon : false,
            disableClickDelay : false
        });
    }
    
    function submitLeadData() {
        var abmLeadX = abmLeads[Math.floor(Math.random() * abmLeads.length)],
        abmUrlX = abmUrls[Math.floor(Math.random() * abmUrls.length)],
        mockLeadX = mockLeads[Math.floor(Math.random() * mockLeads.length)],
        webPageX = webPages[Math.floor(Math.random() * webPages.length)],
        webPageXvisitationRate = webPageX.visitationRate * webPages.length,
        signUpPage;
        
        if (mockLeadX.mobileNumber == null) {
            mockLeadX.mobileNumber = "";
        }
        if (mockLeadX.phoneNumber == null) {
            mockLeadX.phoneNumber = "";
        }
        
        signUpPage = {
            formPostUrl : "http://" + domain + "/index.php/leadCapture/save2?" + "FirstName=" + encodeURIComponent(mockLeadX.firstName) + "&LastName=" + encodeURIComponent(mockLeadX.lastName) + "&Email=" + encodeURIComponent(mockLeadX.email) + "&Title=" + encodeURIComponent(mockLeadX.jobTitle) + "&Company=" + encodeURIComponent(mockLeadX.company) + "&Industry=" + encodeURIComponent(mockLeadX.industry) + "&LeadSource=" + encodeURIComponent(mockLeadX.leadSource) + "&MobilePhone=" + encodeURIComponent(mockLeadX.mobileNumber) + "&Phone=" + encodeURIComponent(mockLeadX.phoneNumber) + "&Lead_Type__c=Business&isMockLead=yes&formid=1069&formVid=1069&lpId=1178" + reqStaticParams
        };
        
        resetMunchkinCookie();
        if (abmLeadX
             && abmUrlX) {
            console.log("Posting > ABM Lead > Visit Web Page: " + abmLeadX.email + " : " + abmUrlX);
            //Munchkin.munchkinFunction("associateLead", {Email: abmLeadX.email}, abmLeadX.hash);
            //Munchkin.munchkinFunction("visitWebPage", {url: abmUrlX});
        }
        
        resetMunchkinCookie();
        if (mockLeadX
             && webPageX) {
            console.log("Posting > Mock Lead > Form Fill:\n" + JSON.stringify(mockLeadX, null, 2));
            webRequest('POST', signUpPage.formPostUrl);
            
            console.log("Associating > Mock Lead: " + mockLeadX.email);
            //Munchkin.munchkinFunction("associateLead", {Email: mockLeadX.email}, mockLeadX.hash);
            
            if (webPageXvisitationRate >= 1.0
                 || (Math.random()) <= webPageXvisitationRate) {
                console.log("Posting > Mock Lead > Visit Web Page: " + mockLeadX.email + " : " + webPageX.urlPath);
                //Munchkin.munchkinFunction("visitWebPage", {url: webPageX.urlPath});
            } else {
                console.log("NOT Posting > Mock Lead > Visit Web Page: " + webPageX.urlPath + " due to web page visitation rate (" + webPageXvisitationRate + ")");
            }
        }
    }
    
    function initMunchkin() {
        if (didInit === false) {
            didInit = true;
            submitLeadData();
        }
    }
    
    s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "//munchkin.marketo.net/munchkin.js";
    s.onreadystatechange = function () {
        if (this.readyState == "complete" || this.readyState == "loaded") {
            initMunchkin();
        }
    };
    s.onload = initMunchkin;
    document.getElementsByTagName("head")[0].appendChild(s);
})();