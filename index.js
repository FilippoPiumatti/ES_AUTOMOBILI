"use strict"

const URL = "http://localhost:3000"
$(document).ready(function(){
   let _lstMarche = $("#lstMarche");
   let _lstModelli = $("#lstModelli");
   let _table = $("table");
   let _dettagli = $(".row").eq(2).children("div").eq(1);
   _dettagli.hide();

   let request = inviaRichiesta("get", URL + "/marche");
   request.fail(errore);
   request.done(function(marche){
      for(let marca of marche)
         $("<option>").val(marca.id).text(marca.nome).appendTo(_lstMarche);
      _lstMarche.prop("selectedIndex", -1);
   });

   _lstMarche.on("change", function(){
      let marcaSelezionata = _lstMarche.val();
      let request = inviaRichiesta("get",
          URL+"/modelli?codMarca="+marcaSelezionata);
      request.fail(errore);
      request.done(function(modelli){
         _lstModelli.html("");
         for(let modello of modelli){
            $("<option>").val(modello.id)
                .text(modello.nome+" "+modello.alimentazione)
                .prop({
                       "nome":modello.nome,//settiamo il nome e il modello come property 
                       //cosi da utilizzarlo anche dopo
                       "alimentazione":modello.alimentazione
                     })
                .appendTo(_lstModelli);
         }
         _lstModelli.prop("selectedIndex", -1);
      });
   });

   _lstModelli.on("change",function(){

      _table.html("")
      let codiceModello = _lstModelli.val();
      let selectedOption = $(this).children("option").eq(this.selectedIndex);
      let nomeModello = selectedOption.prop("nome");
      let alimentazioneModello = selectedOption.prop("alimentazione");


      let request = inviaRichiesta("get",
          URL+"/automobili?codModello="+codiceModello);
      request.fail(errore);
      request.done(function(automobili){

         CreaIntestazioneTabella();
         for (const auto of automobili) {
            CreaRigaTabella(auto,nomeModello,alimentazioneModello);
         }
      })
   });

   function CreaIntestazioneTabella(){
      let tHead = $("<thead>").appendTo(_table);
      let tr = $("<tr>").appendTo(tHead);

      let td = $("<td>").appendTo(tr);
      td.text("Nome").css("width","15%");
      
      td = $("<td>").appendTo(tr);
      td.text("Alimentazione").css("width","15%")

      td = $("<td>").appendTo(tr);
      td.text("Colore").css("width","15%");

      td = $("<td>").appendTo(tr);
      td.text("Anno").css("width","10%");

      td = $("<td>").appendTo(tr);
      td.text("Prezzo").css("width","10%");

      td = $("<td>").appendTo(tr);
      td.text("Img").css("width","20%");

      td = $("<td>").appendTo(tr);
      td.text("Dettagli").css("width","13%");

      td = $("<td>").appendTo(tr);
      td.text("Elimina").css("width","12%");

       let tBody = $("<tbody>").appendTo(_table);


   }
   function CreaRigaTabella(automobile,nomeModello,alimentazioneModello){
      
      let tBody = _table.children("tbody");
      let tr = $("<tr>").appendTo(tBody);

      let td = $("<td>").appendTo(tr);
      td.text(nomeModello)

      td = $("<td>").appendTo(tr);
      td.text(alimentazioneModello)

      td = $("<td>").appendTo(tr);
      td.text(automobile.colore)

      td = $("<td>").appendTo(tr);
      td.text(automobile.anno)

      td = $("<td>").appendTo(tr);
      td.text(automobile.prezzo)

      td = $("<td>").appendTo(tr);
      let img = $("<img>").appendTo(td);
      img.prop("src","img/" + automobile.img).css("height","65px").css("width","65px");

      td = $("<td>").appendTo(tr);
      let btnDettagli = $("<button>").appendTo(td);
      btnDettagli.text("Dettagli").prop("id",automobile.id).on("click",ShowDetails)
      .css("width","80px")
      .css("border","3px solid green")
      .css("border-radius","3px")
      .css("height","50px")
      .css("background-color","green");

      td = $("<td>").appendTo(tr);
      let btnElimina = $("<button>").appendTo(td).prop("id",automobile.id).on("click",DeleteRecord)
      btnElimina.text("Elimina")
      .css("width","80px")
      .css("border","3px solid gray")
      .css("border-radius","3px")
      .css("height","50px")
      .css("background-color","gray");
   }

   function ShowDetails(){
      
   }
   function DeleteRecord(){
      let CodiceAuto = $(this).prop("id");//recupero id del bottone cliccato
      let request = inviaRichiesta("delete",URL + "/automobili/" + CodiceAuto);

      request.fail(errore);
      request.done(function(dati){
         alert("Record rimosso correttamente...");
         _lstModelli.trigger("change");//triggera, costringe , forza l evento change
      })
   }
});

