window.onload = function(){
    AOS.init();
    if(window.location.href.indexOf("index.html") == -1){
        $("#main").addClass("fj-pt-75");
    }
    ajaxCallBack("assets/data/nav.json", function(result){
        printNav(result);
    });
    if(window.location.href.indexOf("izlog.html") != -1){
        let divChange = document.getElementById("itemShow");
        divChange.style.display = "none";
        ajaxCallBack("assets/data/categories.json", function(result){
            printCategories(result);
            printItemsCallBack();
        });
        $(document).on('keyup', "#equipmentSearch", function(){
            printItemsCallBack();
        })
        $(document).on("change", ".furnitureCategory", function(){
            printItemsCallBack();
        });
    }
}

function printItemsCallBack(){
    ajaxCallBack("assets/data/equipment.json", function(result){
        printItems(result);
    });
}

function printNav(data){
    let html = "";
    for(let d of data){
        html += 
        `<li class="nav-item">
            <a class="nav-link" href="${d.href}">${d.name}</a>
        </li>`;
    }
    $("#printNavBar").html(html);
}

function printCategories(data){
    let html = "";
    for(let d of data){
        html += 
        `<li>
            <div class="form-check form-check-inline">
                <input class="form-check-input furnitureCategory" type="checkbox" id="inlineCheckbox1" value="${d.id}">
                <label class="form-check-label" for="inlineCheckbox1">${d.name}</label>
            </div>
        </li>`;
    }
    $("#printCategories").html(html);
}

function printItems(data){
    let html = "";
    let searchVal = $("#equipmentSearch").val();
    if(searchVal.length != 0 && searchVal != ""){
        data = data.filter(x => x.name.indexOf(searchVal) != -1);
    }
    data = filterCheck(data, "furnitureCategory");
    if(data.length == 0){
        html = "Nema predmeta za date parametre pretrage.";
    }
    for(let d of data){
        
        html += `
        <div class="card fj-w-30 mb-4 text-center">
            <img class="card-img-top" src="assets/img/sto.jpg" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${d.name}</h5>
                <p class="price">&euro; 800</p>
                <a href="#" class="btn btn-primary shoWindow fj-site-bg-color">Pregled</a>
            </div>
        </div>`;
    }
    $("#printItems").html(html);
    $(".shoWindow").on('click', function(){
        document.getElementById("itemShow").style.display = "flex";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
    })
    $("#closeWindow").on("click", function(){
        console.log("zatvori");
        document.getElementById("itemShow").style.display = "none";
        document.getElementsByTagName("body")[0].style.overflow = "visible";
    });
}

function filterCheck(data, klasa){
    let selected = [];
    $(`.${klasa}:checked`).each(function(){
        selected.push(parseInt($(this).val()));
    });
    if(selected.length != 0){
        return data.filter(x => selected.includes(x.categoryId));
    }
    return data;
}

function ajaxCallBack(u, s){
    $.ajax({
        url: u,
        method: "GET",
        data: "",
        dataType: "json",
        success: s,
        error: function(xhr){
            console.error(xhr);
        }
    });
}
