console.log("RezMagic Reservation Grouping V1.4 Loaded");

$(function () {

    setTimeout(function () {

        var $reservations = $('#reservations');

        if (!$reservations.length) {
            console.log("Reservations container not found");
            return;
        }

        var groups = {};

        $('.rezlist-container').each(function () {

            var $reservation = $(this);

            var status = $reservation
                .find('.rezlist-status')
                .text()
                .replace('Status', '')
                .trim();

            if (!groups[status]) {
                groups[status] = [];
            }

            groups[status].push($reservation.detach());

        });

        $reservations.empty();

        // ==================================================
        // SEARCH + ACTION BAR
        // ==================================================

        var searchPanel = $(`
            <div id="rez-search-panel"
                 style="
                    background:#ffffff;
                    padding:15px;
                    border:1px solid #ddd;
                    border-radius:6px;
                    margin-bottom:15px;
                 ">

                <div style="
                    font-weight:700;
                    color:#15303a;
                    margin-bottom:10px;
                    font-size:18px;
                ">
                    Search Reservations
                </div>

                <input id="rez-search"
                       type="text"
                       placeholder="Search Reservation #, Traveler Name, or Event"
                       style="
                            width:100%;
                            padding:10px;
                            border:1px solid #ccc;
                            border-radius:4px;
                            color:#15303a;
                            margin-bottom:10px;
                       ">

                <div>

                    <button id="rez-expand-all"
                            style="
                                margin-right:8px;
                                padding:8px 12px;
                                border:1px solid #ccc;
                                background:#f8f8f8;
                                cursor:pointer;
                                border-radius:4px;
                            ">
                        Expand All
                    </button>

                    <button id="rez-collapse-all"
                            style="
                                padding:8px 12px;
                                border:1px solid #ccc;
                                background:#f8f8f8;
                                cursor:pointer;
                                border-radius:4px;
                            ">
                        Collapse All
                    </button>

                </div>

            </div>
        `);

        $reservations.before(searchPanel);

        // ==================================================
        // DISPLAY ORDER
        // ==================================================

        var displayOrder = [
            'Active',
            'Revise',
            'TemporaryHold',
            'ReviseComplete',
            'Complete',
            'CancelPending',
            'Cancelled'
        ];

        Object.keys(groups).forEach(function (status) {

            if (displayOrder.indexOf(status) === -1) {
                displayOrder.push(status);
            }

        });

        // ==================================================
        // BUILD GROUPS
        // ==================================================

        displayOrder.forEach(function (status) {

            if (!groups[status]) return;

            var count = groups[status].length;

            var section = $(`
                <div class="rez-status-group">

                    <div class="rez-status-header"
                         style="
                            cursor:pointer;
                            background:#ffffff;
                            color:#15303a;
                            padding:12px 15px;
                            margin-top:12px;
                            border:1px solid #ddd;
                            border-radius:6px;
                            font-weight:700;
                            font-size:18px;
                         ">
                        ▶ ${status} (${count})
                    </div>

                    <div class="rez-status-content"
                         style="display:none;">
                    </div>

                </div>
            `);

            var content = section.find('.rez-status-content');

            groups[status].forEach(function ($reservation) {
                content.append($reservation);
            });

            section.find('.rez-status-header').on('click', function () {

                var body = $(this).next();

                body.slideToggle(150);

                var text = $(this).text();

                if (text.startsWith('▼')) {

                    $(this).text(
                        text.replace(/^▼/, '▶')
                    );

                } else {

                    $(this).text(
                        text.replace(/^▶/, '▼')
                    );

                }

            });

            $reservations.append(section);

        });

        // ==================================================
        // EXPAND ALL
        // ==================================================

        $('#rez-expand-all').on('click', function () {

            $('.rez-status-content').show();

            $('.rez-status-header').each(function () {

                var text = $(this).text();

                if (text.startsWith('▶')) {

                    $(this).text(
                        text.replace(/^▶/, '▼')
                    );

                }

            });

        });

        // ==================================================
        // COLLAPSE ALL
        // ==================================================

        $('#rez-collapse-all').on('click', function () {

            $('.rez-status-content').hide();

            $('.rez-status-header').each(function () {

                var text = $(this).text();

                if (text.startsWith('▼')) {

                    $(this).text(
                        text.replace(/^▼/, '▶')
                    );

                }

            });

        });

        // ==================================================
        // SEARCH
        // ==================================================

        $('#rez-search').on('keyup', function () {

            var searchText = $(this)
                .val()
                .toLowerCase()
                .trim();

            if (searchText === '') {

                $('.rezlist-container').show();

                $('.rez-status-group').show();

                $('.rez-status-content').hide();

                $('.rez-status-header').each(function () {

                    var text = $(this).text();

                    $(this).text(
                        text.replace(/^▼/, '▶')
                    );

                });

                return;
            }

            $('.rez-status-group').each(function () {

                var groupHasMatch = false;

                $(this)
                    .find('.rezlist-container')
                    .each(function () {

                        var cardText = $(this)
                            .text()
                            .toLowerCase();

                        if (cardText.indexOf(searchText) > -1) {

                            $(this).show();
                            groupHasMatch = true;

                        } else {

                            $(this).hide();

                        }

                    });

                if (groupHasMatch) {

                    $(this).show();

                    $(this)
                        .find('.rez-status-content')
                        .show();

                    $(this)
                        .find('.rez-status-header')
                        .each(function () {

                            var text = $(this).text();

                            $(this).text(
                                text.replace(/^▶/, '▼')
                            );

                        });

                } else {

                    $(this).hide();

                }

            });

        });

        console.log("Reservation Grouping V1.4 Initialized");

    }, 750);

});
