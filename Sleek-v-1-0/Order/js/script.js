function setcategory(cat) {
    var categories = `<option value=${cat}>${cat}</option>`;
    return categories;
}

function Addcategory() {

    //var subid = $(this).data("id");
    console.log("Hello World");
    $.ajax({
        url: "/Sleek-v-1-0/Sub-category/ajax.php",
        type: "GET",
        dataType: "json",
        data: { action: "addCategory" },
        beforeSend: function () {

        },

        success: function (category) {

            if (category) {
                var categorylist = "";
                $.each(category, function (index, cat) {
                    categorylist += setcategory(cat.category_Name);
                });
            }
            $('#category').html(categorylist)
            $('#overlay').fadeOut();
        },
        error: function () {

        },

    });

}


function pagination(totalpages, currentpage) {
    console.log(totalpages + " " + currentpage);
    var pagelist = "";
    if (totalpages > 1) {
        currentpage = parseInt(currentpage);
        pagelist += `<ul class="pagination justify-content-center">`;
        const prevClass = currentpage == 1 ? " disabled" : "";
        pagelist += `<li class="page-item${prevClass}"><a class="page-link" href="#" data-page="${currentpage - 1}">Previous</a></li>`;
        for (let p = 1; p <= totalpages; p++) {
            const activeClass = currentpage == p ? " active" : "";
            pagelist += `<li class="page-item${activeClass}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
        }
        const nextClass = currentpage == totalpages ? " disabled" : "";
        pagelist += `<li class="page-item${nextClass}"><a class="page-link" href="#" data-page="${currentpage + 1}">Next</a></li>`;
        pagelist += `</ul>`;
    }
    $("#pagination").html(pagelist);


}


function getplayerrow(orderdetail) {
    var orderRow = "";
    if (orderdetail) {

        orderRow = `<tr>  
         <td class="align-middle"></td>
          <td class="align-middle"></td>
          <td class="align-middle">${orderdetail.product_Name}</td>
        <td class="align-middle">${orderdetail.order_Id}</td>
        <td class="align-middle">${orderdetail.quantity}</td>
        <td class="align-middle">${orderdetail.product_Price}</td>
        <td class="align-middle">
        <a href="#" class="btn btn-warning mr-3 edituser"  data-target="#userModal" title="Edit"  data-id="${orderdetail.order_Detail_Id}"><i class="fa fa-pencil-square-o fa-lg"></i></a>
        <a href="#" class="btn btn-danger deleteuser" data-userid="14" title="Delete"  data-id="${orderdetail.order_Detail_Id}"><i class="fa fa-trash-o fa-lg"></i></a>
        </td>
        </tr>`;

    }
    return orderRow;
}



function getplayers() {
    // Addcategory();
    var pageno = $("#currentpage").val();
    $.ajax({
        url: "/Sleek-v-1-0/Order/ajax.php",
        type: "GET",
        dataType: "json",
        data: { page: pageno, action: "getorder" },
        beforeSend: function () {
            $('#overlay').fadeIn();
        },
        success: function (rows) {
            if (rows.Order) {
                var orderdetaillist = "";
                $.each(rows.Order, function (index, orderdet) {
                    orderdetaillist += getplayerrow(orderdet);
                    console.log(orderdetaillist);
                });
                $('#userstable tbody').html(orderdetaillist);

                let totalorderdetail = rows.count;
                let totalpages = Math.ceil(parseInt(totalorderdetail) / 4);
                const currentpage = $("#currentpage").val();
                pagination(totalpages, currentpage);
                $("#overlay").fadeOut();
            }
        },
        error: function () {
            console.log('Something went wrong');

        }
    });
}

$(document).ready(function () {
    //add/edit user

    Addcategory();
    $("#addnewbtn").on("click", function () {
        $("#addform")[0].reset();
        $("#subid").val("");
    });
    $(document).on("submit", "#addform", function (event) {
        event.preventDefault();
        $.ajax({
            url: "/Sleek-v-1-0/Sub-category/ajax.php",
            type: "POST",
            dataType: "json",
            data: new FormData(this),
            processData: false,
            contentType: false,
            beforeSend: function () {
                // $('#overlay').fadeIn();
            },
            success: function (response) {
                console.log(response);
                if (response) {
                    $('#userModal').modal('hide');
                    $("#addform")[0].reset();
                    getplayers();
                    //$('#overlay').fadeOut();
                }
            },

            error: function () {

            },
        });
    });

    $(document).on("click", "ul.pagination li a", function (e) {
        e.preventDefault();
        var $this = $(this);
        const pagenum = $this.data("page");
        $("#currentpage").val(pagenum);
        getplayers();
        $this.parent().siblings().removeClass("active");
        $this.parent().addClass("active");

    });


    function popup() {
        $('[id*="userModal"]').modal('show');
    }
    $(document).on("click", "a.edituser", function () {
        popup();
        var subid = $(this).data("id");

        $.ajax({
            url: "/Sleek-v-1-0/Sub-category/ajax.php",
            type: "GET",
            dataType: "json",
            data: { sid: subid, action: "getSubCategory" },
            beforeSend: function () {
                $("#overlay").fadeIn();
            },

            success: function (subcategory) {
                // console.log(subcategory.sub_Category_Id);
                // console.log(subcategory.sub_Category_Name);
                // console.log(subcategory.category_Name);

                let a = $('#category').val(subcategory.category_Name).attr("selected", "selected");
                console.log(a);
                $('#scategory').val(subcategory.sub_Category_Name);
                $('#subid').val(subcategory.sub_Category_Id);

                $('#overlay').fadeOut();
            },
            error: function () {
                console.log("Something went wrong");
            },
        });
    });

    $(document).on("click", "a.deleteuser", function (e) {
        e.preventDefault();
        var subid = $(this).data("id");
        if (confirm("Are you sure want to delete this?")) {
            $.ajax({
                url: "/Sleek-v-1-0/Sub-category/ajax.php",
                type: "GET",
                dataType: "json",
                data: { sid: subid, action: "deletesubcategory" },
                beforeSend: function () {
                    $("#overlay").fadeIn();
                },

                success: function (res) {
                    if (res.deleted == 1) {
                        getplayers();
                        $("#overlay").fadeOut();
                    }
                },
                error: function () {
                    console.log("Something went wrong");
                }
            });
        }
    });

    $("#searchinput").on("keyup", function () {
        const searchText = $(this).val();

        if (searchText.length > 1) {
            $.ajax({
                url: "/Sleek-v-1-0/Order/ajax.php",
                type: "GET",
                dataType: "json",
                data: { searchQuery: searchText, action: "search" },


                success: function (Orderdetial) {
                    if (Orderdetial) {
                        var Orderdetialslist = "";
                        $.each(Orderdetial, function (index, Orders) {
                            Orderdetialslist += getplayerrow(Orders);
                        });
                        $('#userstable tbody').html(Orderdetialslist);
                        $("#pagination").hide();
                        // $("#overlay").fadeOut();
                    }
                },

            });
        } else {
            getplayers();
            $("#pagination").show();
        }

    });



    getplayers();

});

