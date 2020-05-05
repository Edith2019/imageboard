// console.log("script is linked");

(function () {

    new Vue({
        el: '#main',
        data: {
            name: 'Vegeta',
            seen: true,
            cards: [],
            id: '',
            title: '',
            description: '',
            userName: '',
            file: null,
            showModal: false,
            cardId: '',
            createdat: '',
            minId: '',
            morecards: [],
            newcard: false,
            newcards: '',
            prev: '',
            next: '',
            comments: '',
            usercomments: '',

        },

        mounted: function () {
            console.log('this', this);
            var self = this;
            this.card = location.hash.slice(1);

            axios.get('/cards').then(function (res) {
                var cardsData = res.data;
                console.log("cardsData", cardsData);
                self.cards = res.data;
            });

            window.addEventListener('hashchange', function () {
                self.hashchange();
            });

            this.loadMoreImages();
        },

        methods: {

            hashchange: function () {
                this.showModal = true;
                this.cardId = location.hash.slice(1);
                this.card = this.cardId;
            },

            handleClick: function (e) {
                e.preventDefault();
                var self = this;
                // console.log("this in handle", this);
                var formData = new FormData();
                formData.append('title', this.title);
                formData.append("description", this.description);
                formData.append("userName", this.userName);
                formData.append("file", this.file);
                formData.append("id", this.id);

                axios.post('/upload', formData).then(function (res) {
                    // console.log("response from psot upload", res);
                    // console.log("formData", formData.res);
                    self.id = "";
                    self.title = "";
                    self.description = "";
                    self.userName = "";
                    self.url = "";
                    self.cards.unshift(res.data);
                }).catch(function (err) {
                    console.log("err in post/uploade", err);
                });
            },

            closeModalClick: function () {
                this.showModal = false;
                location.hash = "";
                this.cardId = null;
            },

            handleChange: function (e) {
                this.file = e.target.files[0];
            },

            loadMoreImages: function () {
                var self = this;
                var cards = this.cards;
                console.log("cards more  cards", cards);
                this.newcard = true;
                console.log("cards in loadmoreimage", this.cards);
                this.minId = cards[cards.length - 1].id;

                axios.get('/card/smallId/' + this.minId).then(function (res) {
                    var morecards = res.data;
                    console.log("morecards", morecards);
                    self.morecards = res.data;
                    self.cards.push.apply(self.cards, res.data);
                    if (self.minId === self.cards[self.cards.length - 1].id) {
                        document.getElementById('loadmore').style.visibility = "hidden";
                    }
                }).catch(function (err) {
                    console.log("err in loadmore", err);
                });
            },

            deleteImage: function (cardId) {
                var cardsArr = this.cards;
                for (var i = 0; i < cardsArr.length; i++) {
                    if (cardsArr[i].id === cardId) {
                        console.log("card Id in arr", cardId);
                        axios.post('/cardsdelete', { cardId }).then(function (res) {
                            console.log("res in delete", res);
                            console.log("cardID after axios", self.cards);
                        });
                        cardsArr.splice([i], 1);
                    }
                }
            },
        }

    });
})();