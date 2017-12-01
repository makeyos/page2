call_back_search_input = "#search_input_1";

$(document).ready(function () {
    var phone_fields = 1,
        leave_moniths = {},
        active_adrsearch_destination = "textarea_home_1",
        active_adrsearch_id = 1,
        search_obj = [],
        search_call_obj = [],
        d = new Date(),
        start_month = d.getMonth(),
        start_year = d.getFullYear(),
        sel_month, sel_year = "", result = "",
        monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

    // initialisation first search field
    createNewSearch("searchinput_home_1")
    // end of init.

    for (var j = start_year; j >= 1900; j--) {
        var opt = document.createElement('option');
        opt.value = j;
        opt.innerHTML = j;
        document.getElementById("oyears_home_1").appendChild(opt);
    }

    for (var i = 0; i <= 11; i++) {
        var opt = document.createElement('option');
        opt.value = i + 1;
        opt.innerHTML = monthNames[i];
        document.getElementById("omonths_home_1").appendChild(opt);
    }

/*    $(document).on('change keydown keyup', '#search_input_1', function (e) {
        search_obj['textaara'] = '#textarea_' + $(this).data('search-input-type') + '_' + $(this).data('id');
        search_obj['this'] = $(this);
        search_obj['searchtab'] = '#searchtab_' + $(this).data('search-input-type') + '_' + $(this).data('id');
        search_obj['type'] = $(this).data('search-input-type');
        search_obj['id'] = $(this).data('id');
        /!* console.log(search_obj['id']);
         console.log(search_obj['type']);
         console.log(search_obj['textaara']);
         console.log(JSON.stringify(this, null, 4));*!/
    });*/
    /*
        Post codes - testing
    */

//  SEARCH CONTROLLER ********************************
  /*  controller = new IdealPostcodes.Autocomplete.Controller({
        api_key: "iddqd",
        checkKey: true,
        onLoaded: function () {
            $("#info").html("service ok");
        },
        onFailedCheck: function () {
            $("#info").html("---Please manually enter your address");
        },
        onAddressRetrieved: function (data) {
            var address_raw = JSON.stringify(data, null, 4);
            // call function to list address
            var addressToPrint = "";
            var lines = 0;
            if (data.organisation_name) {
                addressToPrint = addressToPrint + data.organisation_name + "\n";
                lines++;
            }
            if (data.building_name) {
                addressToPrint = addressToPrint + data.building_name + "\n";
                lines++;
            }
            if (data.sub_building_name) {
                addressToPrint = addressToPrint + data.sub_building_name + "\n";
                lines++;
            }
            if (data.line_1 && (data.line_1 !== data.organisation_name)) {
                addressToPrint = addressToPrint + data.line_1 + "\n";
                lines++;
            }
            if (data.line_2) {
                addressToPrint = addressToPrint + data.line_2 + "\n";
                lines++;
            }
            if (data.line_3) {
                addressToPrint = addressToPrint + data.line_3 + "\n";
                lines++;
            }
            if (data.post_town) {
                addressToPrint = addressToPrint + data.post_town + "\n";
                lines++;
            }
            if (data.county) {
                addressToPrint = addressToPrint + data.county + "\n";
                lines++;
            }
            if (data.postcode) {
                addressToPrint = addressToPrint + data.postcode + "\n";
                lines++;
            }

            //  console.log(JSON.stringify(this, null, 4));

            /!*search_tab = '#searchtab_' + search_call_obj["searchInputType"] + '_' + search_call_obj["id"];

            console.log("call from: " + search_call_obj["searchInputType"] + search_call_obj["id"]);

            $(search_obj['textaara']).attr("rows", lines).html(addressToPrint);
            $(search_obj['searchtab']).find("#address_field_" + search_obj['id']).removeClass("hidden");
            $(search_obj['searchtab']).find("#search_input_group_" + search_obj['id']).addClass("hidden");
            $(search_obj['searchtab']).find("#search_heading_" + search_obj['id']).addClass("ok");
*!/
            console.log(address_raw);
        },
        onSearchError: function (error) {
            console.log("suggestions not find: " + error);
        },
        onSuggestionsRetrieved: function (sugg) {
            var sugg_box = $(search_obj['searchtab']).find("#searchsuggcount");

            if (sugg.length === 10) {
                sugg_box.removeClass("danger").addClass("success");
                sugg_box.html("+" + sugg.length + " found");
            } else if (sugg.length > 0 && sugg.length !== 10) {
                sugg_box.removeClass("danger").addClass("success");
                sugg_box.html(sugg.length + " found");
            } else {
                sugg_box.removeClass("success").addClass("danger");
                sugg_box.html("not found");
            }

            /!*console.log('this: ' + JSON.stringify($(this), null, 5));
            console.log("call from: " + search_call_obj["searchInputType"] + search_call_obj["id"]);

            console.log(JSON.stringify(this["interface"]["input"][call_obj_keys[0]], null, 4));
            console.log("object keys: " + call_obj_keys[0]);*!/

        },
        inputField: call_back_search_input
    });*/

    function createNewSearch(input_field) {
        return new IdealPostcodes.Autocomplete.Controller({
            api_key: "iddqd",
            inputField: "#" + input_field,
            onAddressRetrieved: function(data) {
                var print_address = data.line_1 + "\n" + data.post_town + "\n" + data.postcode + "\n";
                var toadd = search_obj['type'] + "_" + search_obj['id'];
                var dest = "#textarea_" + search_obj['type'] + "_" + search_obj['id'];
                var id = search_obj['id'];
                var lines = 3;

                $('#textarea_' + toadd).attr("rows", lines).html(print_address).addClass("ok");


                $("#addressfield_" + toadd).removeClass("hidden");
                $('#searchinputgroup_' + toadd).addClass("hidden");
                $("#panel_" + toadd).addClass("ok");

            },
            onSuggestionsRetrieved: function (sugg) {
                var sugg_box = $("#searchsuggcount_" + search_obj['type'] + "_" + search_obj['id']);

                if (sugg.length === 10) {
                    sugg_box.removeClass("danger").addClass("success");
                    sugg_box.html("+" + sugg.length + " found");
                } else if (sugg.length > 0 && sugg.length !== 10) {
                    sugg_box.removeClass("danger").addClass("success");
                    sugg_box.html(sugg.length + " found");
                } else {
                    sugg_box.removeClass("success").addClass("danger");
                    sugg_box.html("not found");
                }
            }
        });
    }


 /*   $('div#homeaddresspanel').on('show.bs.collapse', function () {
        // console.log(JSON.stringify(this, null, 4));
        /!*call_back_search_input = "#search_input_" + $(this).data('id');
        console.log('hidden ' + $(this).data('id'));
        console.log(call_back_search_input);*!/
    })*/

    $(document).on('click', "button#test_button1", function (e) {
        call_back_search_input = "#search_input_2";
        console.log('been clicked!' + call_back_search_input);

        //console.log($(this).find("a").text());
    });

    ///////// END  //////////////


    $(document).on('click', "[name='rmaddress']", function () {

        var toremove = $(this).data('type') + "_" + $(this).data('id');

        $('#textarea_' + toremove).attr("rows", 1).html('').removeClass('ok');
        $('#addressfield_' + toremove).addClass("hidden");
        $('#searchinputgroup_' + toremove).removeClass("hidden");
        $("#panel_" + toremove).removeClass("ok");

    });

    $(document).on('click', "#option_months, #option_years", function (e) {
        // document.getElementById(this.id).removeChild(this.childNodes[1]);
    });

    $(document).on("change keyup keydown", "[name='adrsearch']", function() {
        console.log("test of imput: " + this.id);
        search_obj['id'] = $(this).data('id');
        search_obj['type'] = $(this).data('type')
        //console.log("destination: " + active_adrsearch_destination);
    });

    $(document).on('change', "[name='option_months'], [name='option_years']", function () {

        var id = $(this).data('id'),
            type = $(this).data('type'),
            field = this.id,
            value = this.value;


        search_obj['id'] = id;
        search_obj['type'] = type;

        function setValue(object, path, value) {
            var last = path.pop();
            path.reduce(function (o, k) {
                return o[k] = o[k] || {};
            }, object)[last] = value;
        }

        setValue(leave_moniths, [type, id, field], value);



        console.log("==> "+ JSON.stringify(leave_moniths, null ,4));

        if ($(this).attr('name') === "option_months") sel_month = this.value;
        if ($(this).attr('name') === "option_years") sel_year = this.value;


        existing_tabs = $('div#' + search_obj['type'] + 'addresspanel').length;
        new_tab_nr = existing_tabs + 1;


        console.log('objects: ' + $(this).data('id') + '. existing: ' + existing_tabs);



        today = start_year * 12 + start_month;
        selected_date = sel_year * 12 + sel_month * 1;
        len_mnt = today - selected_date;

        /*console.log(start_year + ' + ' + start_month + ' = ' + today);
        console.log(sel_year + ' + ' + sel_month + ' = ' + selected_date);
        console.log(len_mnt);*/


        if (sel_month !== "" && sel_year !== "") {
            if (len_mnt <= 35) {
                console.log("checked but less then 3 years! " + len_mnt);
                $("#collapse_" + search_obj['id']).collapse('toggle');

                console.log('hellol!!!! - ' + search_obj['id']);
                //document.getElementById("title_collapse_" + search_obj['id']).innerHTML = "Address #1 - ok";

                sel_year = "";
                sel_month = "";
                var new_tab_nr = search_obj['id'] + 1;
                var title = '<span class="pull-left glyphicon glyphicon-asterisk"></span><h4 class="panel-title"><a style="padding-left: 0.4em;">Your previous address</a></h4>'
                //creating a clone of a tab
                var controlForm = $('#accordion:first'),
                    currentEntry = $('#' + search_obj['type'] + 'addresspanel:first')

                //currentEntry.find('div#collapse_' + search_obj['id']).removeClass('in');
                //currentEntry.find('div#title_collapse_' + search_obj['id']).addClass('collapsed');

                var newEntry = $(currentEntry.clone());

                /*  newEntry.find('#panel-heading').prop("id","headingTwo");
                  newEntry.find('#collapse_label_1').text("Address #2").prop("id","collapse_label_2").prop("href","#collapseTwo");
                 newEntry.find("#collapseOne:last").attr("id","collapseTwo").removeClass("in").collapse("toggle");
                 */
                newEntry.find('div#title_collapse_' + search_obj['id']).attr('id', 'title_collapse_' + new_tab_nr).children('div:first').attr('href', '#collapse_' + new_tab_nr).html(title).collapse("toggle");
                newEntry.find('div#collapse_' + search_obj['id']).attr('id', 'collapse_' + new_tab_nr).addClass('in');
                newEntry.find('div#hiddeninfo_' + search_obj['id']).attr('id', 'hiddeninfo_' + new_tab_nr).removeClass("hidden");
                newEntry.find(':input').data('id', new_tab_nr)

                newEntry.appendTo(controlForm);
            } else {
                console.log("checked and ALL GOOD " + len_mnt)

            }
        }
    });

    $(document).on('change keydown keyup', 'input', function (e) {
        var ver_type = this.getAttribute("ver");
        var ver_req = this.getAttribute("req");
        var inp_txt = this.value;
        var status = "";

        //console.log("=> " + inp_txt + " = " + ver_req + " <=> " + ver_type);

        switch (ver_type) {
            case "text-only":
                if (inp_txt !== "") {
                    status = "ok"
                }
                ;
                break;
            case "email":
                if (inp_txt) {
                    status = "ok"
                }
                ;
                break;
            case "email1":
                if (inp_txt) {
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    var result = re.test(inp_txt);

                    if (result) {
                        status = "ok"
                    }
                    if ($("#email2").val() !== "") {
                        if ($("#email2").val() === inp_txt) {
                            mark($("#email2"), "ok");
                        } else {
                            mark($("#email2"), "fail");
                        }
                    }
                }
                ;
                break;
            case "email2":
                if ($("#email1").val() === $("#email2").val()) {
                    status = "ok";
                } else {
                    status = "fail";
                }
                break;
            case "phone-only":
                if (inp_txt) {
                    var maintainplus = '';
                    //console.log(inp_txt.charAt(0));
                    if (inp_txt.charAt(0) === '+') {
                        maintainplus = '+';
                    }
                    var curphonevar = inp_txt.replace(/[\\A-Za-z!"£$%^&\,*+_={};:'@#~,.Š\/<>?|`¬\]\[]/g, '');
                    this.value = (maintainplus + curphonevar);
                    var maintainplus = '';
                    if (curphonevar.length >= 9) {
                        status = "ok"
                    }
                    ;
                }
                ;
                break;
            case "dob":
                var format = "dd/mm/yyyy";
                var match = new RegExp(format
                    .replace(/(\w+)\W(\w+)\W(\w+)/, "^\\s*($1)\\W*($2)?\\W*($3)?([0-9]*).*")
                    .replace(/m|d|y/g, "\\d"));
                var replace = "$1/$2/$3$4"
                    .replace(/\//g, format.match(/\W/));

            function doFormat(target) {
                target.value = target.value
                    .replace(/(^|\W)(?=\d\W)/g, "$10")   // padding
                    .replace(/[\\A-Za-z!"£$%^&\,*+_={};:'@#~,.Š\/<>?|`¬\]\[]/g, "")
                    .replace(match, replace)             // fields
                    .replace(/(\W)+/g, "$1");            // remove repeats
            }

                //var len = inp_txt.length;
                //inp_txt = inp_txt.replace(/[\\A-Za-z!"£$%^&\,*+_={};:'@#~,.Š\/<>?|`¬\]\[]/g,"");
                //this.value = inp_txt;


                if (!e.ctrlKey && !e.metaKey && (e.keyCode === 32 || e.keyCode > 46))
                    doFormat(e.target)

                const regex = /\b(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[12])[/](19[0-9]{2}|20[0-9]{2})/g;

                if (regex.test(inp_txt)) {
                    status = "ok"
                }
                ;
                //console.log(inp_txt);

                break;
        }
        ;

        if (ver_req === 0 && !status) {
            status = "option";
        }
        ;

        if (ver_type !== "none") {
            mark(this, status);
        }
        ;
        //console.log(item_id + ": " + inp_txt);


    });



    // end of ready(functon)


    function mark(item, status) {


        var $group = $(item).closest('.input-group'),
            $addon = $group.find('.input-group-addon'),
            $icon = $addon.find('span');

        //console.log("going to change class for: " + $addon.attr("class"));

        $("#info3").text(status);

        switch (status) {
            case "ok":
                $addon.addClass('success');
                $addon.removeClass('info');
                $addon.removeClass('danger');
                $icon.attr('class', 'glyphicon glyphicon-ok');
                break;
            case "option":
                $addon.addClass('info');
                $addon.removeClass('success');
                $addon.removeClass('danger');
                $icon.attr('class', 'glyphicon glyphicon-asterisk');
                break;
            default:
                $addon.addClass('danger');
                $addon.removeClass('success');
                $addon.removeClass('info');
                $icon.attr('class', 'glyphicon glyphicon-remove');
        }
    }

});