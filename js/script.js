let userAction_theme = false;
let userAction_zoom = false;
let themeData = null;

$(function(){
    defaultTheme();

    $('#textarea').keyup(function(){
        countText();
    });
    
    $(document).bind('paste', function(){
        setTimeout(countText,100);
    });
    
    $('.copy_button').on('click',function(){
        const textarea = document.getElementById("textarea");
        textarea.select();
        document.execCommand("copy"); 
        $(".copy_text").text("コピーしました");
        setTimeout(()=>$(".copy_text").text(themeData.texts.copy),1000);
    });

    $('.save_button').on('click',function(){
        saveSetting();
        setTimeout(closeSetting,400);
    });

    $('.setting_button').on('click',function(){
        $('body').addClass("setting");
    })

    $('.back_button').on('click',function(){
        if(userAction_theme || userAction_zoom){
            const result = window.confirm("変更を保存しますか？");
            if(result){
                saveSetting();
            }else{
                defaultTheme();
            }
        }
        closeSetting();
    })


    $('#zoom').change(function() {
        const val = $(this).val();

        if(localStorage.getItem('zoom') == val){
            userAction_zoom = false;
        }else{
            userAction_zoom = true;
        }
        $("body").css("zoom", `${val}%`);
    });

    $('#themes').change(function() {
        userAction = true;
        const val = $(this).val();

        console.log(`デフォ: ${themeData.id}, 新規: ${val}`)

        if(localStorage.getItem('theme') == val){
            userAction_theme = false;
            console.log("0")
        }else{
            userAction_theme = true;
            console.log("1")
        }
        changeTheme(val);
    });
});

const countText = ()=>{
    const count = $("#textarea").val().replace(/\s+/g,"").length;
    $('#count').text(count);
    if (count > 0){
        $("#wrap_app").addClass("on");
    }else{
        $("#wrap_app").removeClass("on");
    }
}

const saveSetting = ()=>{
    const theme_val = $("#themes").val();
    const zoom_val = $("#zoom").val();
    localStorage.setItem('theme', theme_val);
    localStorage.setItem('zoom', zoom_val);
    $(".save_text").text("保存しました");
}

const closeSetting = ()=>{
    userAction_theme = false;
    userAction_zoom = false;
    $('body').removeClass("setting");
    setTimeout(()=>$(".save_text").text(themeData.texts.save),300);
}

const defaultTheme = ()=>{
    const theme = localStorage.getItem('theme');
    const zoom = localStorage.getItem('zoom');

    pageZoom = zoom;

    if(theme){
        changeTheme(theme);
        $(`#themes option[value='${theme}']`).prop('selected', true);
    }else{
        changeTheme("1");
        $("#themes option[value='1']").prop('selected', true);
    }
    if(zoom){
        $("body").css("zoom", `${zoom}%`);
        $(`#zoom option[value='${zoom}']`).prop('selected', true);
    }else{
        $("body").css("zoom", "100%");
        $("#zoom option[value='100']").prop('selected', true);
    }
}

const changeTheme = (number)=>{
    const url = `themes/theme-${number}.json`
    $.getJSON(url, (data) => {

        themeData = data;

        console.log(`name=${data.name}`);
        const root = document.documentElement;
        
        //color
        root.style.setProperty('--main-color', data.colors.main);
        root.style.setProperty('--second-color', data.colors.second);
        root.style.setProperty('--black-color', data.colors.black);
        root.style.setProperty('--white-color', data.colors.white);
        root.style.setProperty('--dark-white-color', data.colors.dark_white);
        root.style.setProperty('--shadow-color', data.colors.shadow);
        if(data.type == "mono"){
            root.style.setProperty('--object-text-color', data.colors.black);
            root.style.setProperty('--sub-object-text-color', data.colors.white);
        }else{
            root.style.setProperty('--object-text-color', data.colors.white);
            root.style.setProperty('--sub-object-text-color', data.colors.black);
        }

        //font
        root.style.setProperty('--main-font', data.fonts.main);
        root.style.setProperty('--second-font', data.fonts.second);
        root.style.setProperty('--textarea-font', data.fonts.textarea);
        root.style.setProperty('--textarea-sub-font', data.fonts.textarea_sub);
        
        //text
        $(".copy_text").text(data.texts.copy);
        $(".save_text").text(data.texts.save);
    });
}