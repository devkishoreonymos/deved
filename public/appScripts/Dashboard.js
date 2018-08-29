 function formvaluedata(){
//pproved: {type: String, enum: ['accepted', 'rejected', 'required'], default: 'required'},
//auditorId: 
this.supplier='';
this.date='';
this.orderId='';
this.shopperName='';
this.city='';
this.zone='';
this.orderDate='';
this.dispatchDate='';
this.deliveryDate='';
this.productType='';
this.productName='';
this.productCategory='';
this.platform='';
this.batchCode='';
this.mafDate='';
this.townclass='';
}
var DashBoard = {

    getformvalue: function () {
        try {
            var formvalue=new formvaluedata();
            formvalue.platform= $('#platform').val();
            formvalue.supplier= $('#supplier').val();
            formvalue.productCategory=   $('#select2-product_category-container').val();
           formvalue.date= $('#dashboarddate').val();
            formvalue.orderId= $('#order_id').val();
            formvalue.shopperName =$('#txtshopper').val();
            formvalue.zone=$('#zone').val();
            formvalue.city=$('#selectcity').val();
            formvalue.mafDate= $('#mfd').val();
            formvalue.orderDate=$('#order_date').val();
            formvalue.deliveryDate=$('#txtdelivery_date').val();
            formvalue.productType= $('#selectproduct_type').val();
            formvalue.productName=$('#product_name').val();
            formvalue.batchCode=$('#txtbatchcode').val();
            formvalue.dispatchDate=$('#txtdispatch_date').val();
            formvalue.productCategory=$('#product_category').val();
            formvalue.townclass=$("#selectcity[value='"+formvalue.city+"']").attr('townclass');
            console.log(formvalue);
            $.ajax({
                url: 'http://192.168.0.136:3000/api/orders',
                type: "POST",
                headers: {"Authorization": localStorage.getItem('token')},
                crossDoman:true,
               data: formvalue,
                success: function (response) {
                    window.location="./FormEntries.html";
                    $('#cityList').html(response).find('select').select2();
                }
            })
           //zone,selectcity,mfd,order_date,txtdispatch_date,txtdelivery_date,selectproduct_type,product_name,txtbatchcode
        } catch (ex) {
console.log(ex);
        }

    },
    saveformvalues:function(){
try{

}
   catch (ex) {

        }
    }
}
