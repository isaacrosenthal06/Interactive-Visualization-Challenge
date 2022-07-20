let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

let otu_samples = [];
d3.json(url).then(function(data) {
    for(let i=0; i < 10; i++){
        otu_samples.push(data.samples[i]);
    }
    console.log(otu_samples);
});

let otu_names = [];
d3.json(url).then(function(data) {
    for(let i=0; i < 10; i++){
        otu_names.push(data.names[i]);
    }
    console.log(otu_names);
    init(otu_names);
});

let otu_metadata = [];
d3.json(url).then(function(data) {
    for(let i=0; i < 10; i++){
        otu_metadata.push(data.metadata[i]);
    }
    console.log(otu_metadata);
});

function optionChanged(value) {
    if (value != "Select ID") {
        barchartinit(value);
        bubblechartinit(value);
        demographicinit(value);
    }
}


function init(otu_names) {
    let selection = d3.select('#selDataset');
    console.log("Init Select", selection);
    selection.attr("class","form-select form-select-lg mb-3 fw-bold fs-4");
    selection.append("option").text("Select ID");

    for(let i = 0; i < otu_names.length; i++){
        selection.append("option").text(otu_names[i]).attr("value", otu_names[i])
  }
}

function barchartinit(value) {
    let otu_data = "";
    let otu_ids = [];
    let otu_labels = [];
    let sample_values = [];
    d3.json(url).then(function(data) {
        for(let i=0; i < 10; i++){
            if (value == data.samples[i].id) {
                otu_data = data.samples[i];
            }
        }
        for (let k = 0; k < 10; k++) {
            otu_ids.push("OTU" + (otu_data.otu_ids[k].toString()));
            otu_labels.push(otu_data.otu_labels[k]);
            sample_values.push(otu_data.sample_values[k]);
        }

        var trace_bar = {
            x: sample_values.reverse(),
            y: otu_ids.reverse(),
            hovertemplate: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        var data = [trace_bar];
        Plotly.newPlot('bar', data);
    });

}


function bubblechartinit(value) {
    let otu_data = "";
    let otu_ids = [];
    let sample_values = [];
    let otu_labels = [];
    let otu_ids_sorted = [];
    let index = [];
    d3.json(url).then(function(data) {
        for(let i=0; i < 10; i++){
            if (value == data.samples[i].id) {
                otu_data = data.samples[i];
            }
        }
        for (let k = 0; k < 10; k++) {
            otu_ids.push(otu_data.otu_ids[k]);
            otu_labels.push(otu_data.otu_labels[k]);
        }
        otu_ids_sorted = otu_ids.sort(function(a,b){return a-b});
        for (let x = 0; x < otu_ids_sorted.length; x++) {
            index.push(otu_data.otu_ids.indexOf(otu_ids_sorted[x]));
            sample_values.push(otu_data.sample_values[index[x]]);
            otu_labels.push(otu_data.otu_labels[index[x]]);
        }
    

        var trace_bubble = {
            x: otu_ids_sorted,
            y: sample_values,
            mode: 'markers',
            marker: {
                color: otu_ids_sorted,
                size: sample_values
            },
            hovertemplate: otu_labels
        };

        var layout = {
            xaxis: {
                title: 'OTU ID',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            },
            yaxis: {
                title: 'Sample Values',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            }
          };

        var data = [trace_bubble];
        Plotly.newPlot('bubble', data, layout);
    });


}

function demographicinit(value) {
    let metadata = [];
    let matched_metadata = [];

    d3.json(url).then(function(data) {
        for(let i=0; i < 10; i++){
            metadata.push(data.metadata[i]);
        }
        for (i = 0; i < metadata.length; i++) {
            if (value == metadata[i].id) {
                matched_metadata = metadata[i];
            }
        }
        let meta_selection = d3.select('#sample-metadata');
        meta_selection.html(`ID: ${matched_metadata.id} <br> ethnicity: ${matched_metadata.ethnicity}  <br> Gender: ${matched_metadata.gender} <br> age: ${matched_metadata.age} <br> location: ${matched_metadata.location} <br> bbtype: ${matched_metadata.bbtype} <br> wfreq: ${matched_metadata.wfreq}`);
    });

}

