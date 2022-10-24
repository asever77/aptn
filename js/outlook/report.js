const Report = function (rpt_id) {

    const _this = this;

    this.chart1 = null;
    this.arr = [];
    this.chartList = {
        avg_chart1 : null,
        avg_chart2 : null,
        avg_chart3 : null,
    }
    $('#btn_pdf').on('click', function () {
        $('body').loading({
            theme: 'dark',
            message: 'PDF 파일을 생성중니다...<br> 잠시만 기다리세요.',
        });

        _this.pdfPrint2();
    })
    $('#btn_save').on('click', function () {
        _this.save_content();
    })
    $('#btn_goBack').on('click', function () {
        location.href = "/newsletter/outlook/index.php";
    })


    const $cke_list = $('.cke_cont');

    this.init = function () {
        for (let i = 0; i < report_content.length; i++) {
            for (let j = 0; j < $cke_list.length; j++) {
                if (report_content[i].cke_id === $cke_list[j].id) {
                    CKEDITOR.instances[report_content[i].cke_id].setData(report_content[i].cke_cn);
                    break;
                }
            }

            if (report_content[i].cke_id === 'tmax_h_pctl' || report_content[i].cke_id === 'tmin_h_pctl') {
                const arr = report_content[i].cke_cn.split(',');

                for (let k = 1; k < arr.length; k++) {
                    $(`#${report_content[i].cke_id}_${k}`).text(arr[k]);
                }
                $(`#${report_content[i].cke_id}`).val(arr[0]).prop("selected",true);
            }
        }

        /*this.createChart('tmpr_avg', report_info_tmpr_avg.split(','));
        this.createChart('tmpr_max', report_info_tmpr_max.split(','));
        this.createChart('tmpr_min', report_info_tmpr_min.split(','));*/
    }

    this.createChart = function (id, array) {
        let index = 0;
        for (let i = 0; i < array.length; i += 3) {
            index++;
            const ctx = new Chart(document.getElementById(`chart_${id}_${index}`).getContext('2d'), {
                type : 'bar',
                plugins: [ChartDataLabels],
                data : {
                    labels : ['낮음', '비슷', '높음'],
                    datasets : [{
                        data : [array[i], array[i + 1], array[i + 2]],
                        backgroundColor: [
                            '#34394D',
                            '#7E7F83',
                            '#AF7E82',
                        ],
                        borderColor: [
                            'rgb(255,255,255)',
                            'rgb(255,255,255)',
                            'rgb(255,255,255)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    layout : {
                        padding : {
                            left : 5,
                            right : 5,
                            /*top : 10*/
                        },
                    },
                    scales: {
                        yAxes: {
                            grid: {display:false},
                            display: false,
                            ticks: {
                                beginAtZero: false,
                                min : 0,
                                max : 100,
                                stepSize : 10,
                            },
                            stacked: true,
                        },
                        xAxes: {
                            grid: {display:false},
                            display: false,
                            stacked: true,
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: getPage1ChartText(array[i], array[i + 1], array[i + 2]),
                            position: 'bottom',

                        },
                        tooltip: {
                            enabled: false
                        },
                        datalabels: {
                            align : 'center',
                            color: '#ffffff',
                            font: {
                                weight: 'bold'
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    responsive: true,
                },
            })

            function getPage1ChartText(val1, val2, val3) {
                let text = '평년';

                if (val3 > val1 && val3 > val2) {
                    text += `보다 높을 확률이 ${val3}%임`;
                } else if (val3 === val2 && val3 > val1) {
                    text += `과 비슷하거나 높을 확률이 각각 ${val2}%임`;
                } else if (val2 > val3 && val2 > val1) {
                    text += `과 비슷할 확률이 ${val2}%임`;
                } else if (val2 === val1 && val2 > val3) {
                    text += `과 비슷하거나 낮을 확률이 각각 ${val1}%임`;
                } else if (val1 > val3 && val1 > val2) {
                    text += `보다 낮을 확률이 ${val1}%임`;
                } else {
                    text += `과 다를 확률이 ${val3}%임`;
                }
                return text;
            }
        }

    }


    this.exportPdf =  function(arr) {
        const _this = this;
        console.log(arr);

        const doc = new jspdf.jsPDF('p', 'mm', 'a4');
        const $loading = $('.loading-overlay-content');
        for (let i = 0; i < arr.length; i++) {
            const canvas = arr[i];
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            //canvas.height * 297 / canvas.width

            var width = doc.internal.pageSize.getWidth();
            var height = doc.internal.pageSize.getHeight();
            
            $('body').append('<img class="print-img" url="'+ imgData +'>');

            //297.64112903225805
            if (i > 5) {
                //doc.addImage(imgData, 'PNG', 210, 85, 298, 210, undefined, undefined, 90);
                //y 값 87 하드코딩
                doc.addImage(imgData, 'PNG', width, 87, height, width, undefined, undefined, 90);
            } else {
                //doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, undefined, 0);
                doc.addImage(imgData, 'PNG', 0, 0, width, height, undefined, undefined, 0);
            }

            if (i !== arr.length -1) {
                doc.addPage();
            }
        }
        doc.save('sample.pdf');
        _this.arr = []
        $("body").loading('stop');

    }

    this.pdfPrint2 = function() {
        const that = this;
        const page = $('.a4');

        /*$("body").loading({
            theme : 'dark',
            message: 'PDF 파일을 생성중입니다...<br>잠시만 기다려주세요'
        });*/

        $('.book').addClass('type-print');

        setTimeout(()=> {
            const $loading = $('.loading-overlay-content');
            for (let i = 0; i < page.length; i++) {
                html2canvas(document.querySelector(`.a4:nth-child(${i + 1})`), {scale:2}).then(canvas => {
                    this.arr.splice(i, 0, canvas);

                    console.log('image', canvas.toDataURL("image/jpeg"));
                   
                    

                    $loading.empty();
                    $loading.append(`PDF 이미지를 생성중입니다... <br> 이미지 생성 (${i+1}/${page.length})`);
                    if (this.arr.length === 10) {
                        $loading.empty();
                        $loading.append(`PDF 이미지를 생성중입니다... <br> 이미지 생성 (${i+1}/${page.length})`);
                        setTimeout(()=> {
                            that.exportPdf(this.arr);
                        }, 300)
                    }
                });
            }
        }, 1000);
        // $('.book').removeClass('type-print');

    }

    this.save_content =  function() {

        if (!confirm("저장하시겠습니까?")) {
        } else {
            const arr = [];
            const instances = CKEDITOR.instances;

            for (const instance in instances) {
                const obj = {};
                obj['id'] = instance;
                obj['content'] = instances[instance].getData();
                arr.push(obj);
            }

            // 전국 월별 최고 최저기온
            const tmax_h_pctl_arr = [$('#tmax_h_pctl option:selected').val()];
            const tmin_h_pctl_arr = [$('#tmin_h_pctl option:selected').val()];

            for (let i = 1; i < 5; i++) {
                tmax_h_pctl_arr.push($(`#tmax_h_pctl_${i}`).text());
                tmin_h_pctl_arr.push($(`#tmin_h_pctl_${i}`).text())
            }

            arr.push({id : 'tmax_h_pctl', content : tmax_h_pctl_arr.toString()});
            arr.push({id : 'tmin_h_pctl', content : tmin_h_pctl_arr.toString()});

            $.post('/newsletter/outlook/post/insert_content.php', {data : arr,rpt_id : rpt_id}, function (res) {
                const response = JSON.parse(res)

                if (response.success) {
                    alert("저장되었습니다.");
                }
            })
        }

    }

    this.delete_content = function() {
        $.post('/newsletter/outlook/post/delete.php', {rpt_id : rpt_id}, function (res) {
            const response = JSON.parse(res)
            if (!confirm("삭제하시겠습니까?")) {
            } else {
                if (response.success) {
                    alert("삭제되었습니다");
                    location.href='http://localhost:8081/newsletter/outlook/index.php'
                }
            }

        })
    }

    this.getCanvasImage = function (pageNum) {

        html2canvas(document.querySelector(`.a4:nth-child(${pageNum})`), {scale:2}).then(canvas => {
            const a = document.createElement('a');
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            a.download = `${pageNum}page.jpg`;
            a.click();
        });

    }

}