Vue.component('modal', {
    template: '#modal-template',
    props: ['card'],
    data: function () {
        return {
            showModal: true,
            usercomments: '',
            textcomments: '',
            title: '',
            description: '',
            username: '',
            url: '',
            createdat: '',
            comments: [],
            previous: '',
            next: '',
            newcards: '',
        };
    },

    watch: {
        card: function () {
            this.showCard();
        }
    },

    mounted: function () {
        console.log("this in mounted component", this);
        var self = this;
        console.log("self card", self.card);
        this.showCard();
    },

    methods: {

        showCard: function () {
            var self = this;
            axios.get('/cards/comments/?id=' + self.card).then(function (res) {
                var cardIdData = self.card;
                console.log("cardID in compoenent", cardIdData);
                self.card = res.data;

                self.url = res.data.commenting[0].url;

                console.log("self url", self.url);
                self.title = res.data.commenting[0].title;
                self.description = res.data.commenting[0].description;
                self.username = res.data.commenting[0].username;
                self.usercomments = res.data.commenting[0].usercomments;
                self.textcomments = res.data.commenting[0].textcomments;
                self.createdat = res.data.commenting[0].created_at;
                self.comments = res.data.commenting;

                self.previous = res.data.prevNext[0].previous_card;
                self.next = res.data.prevNext[0].next_card;

                self.usercomments = "";
                self.textcomments = "";

            }).catch(function (err) {
                console.log('closeError', this.cardId, err);

            });
        },

        handleCommentClick: function (e) {
            e.preventDefault();
            var self = this;

            document.querySelector('.inputCommentsUser').value = "";
            document.querySelector('.inputCommentsText').value = "";

            var usercomments = this.usercomments;
            console.log("sueromment", usercomments);
            var textcomments = this.textcomments;
            console.log("sueromment", textcomments);

            var comments = {
                usercomments: this.usercomments,
                textcomments: this.textcomments,
                id: this.card,
                createdatcom: this.createdat
            };
            console.log("var comments ", comments);
            axios.post('/uploadcomments', comments).then(function (res) {
                var comments = res.data;
                console.log("comment in post ", comments);
                console.log("resps in post axios comment", res);
                self.comments.unshift(comments);
                console.log("user comments in uploadcomments", usercomments);
                self.usercomments = "";
                self.textcomments = "";
            }).catch(function (err) {
                console.log("error in post/upload comment", err);
            });
        },

        changed: function () {
            this.$emit('changed', this.cardId);
            console.log("changed function test");
        },
    },
});

