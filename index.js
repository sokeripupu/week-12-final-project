// Smurfs
class Smurf {
  constructor(name, characteristics) {
    this.name = name;
    this.characteristics = characteristics;
  }
}

class SmurfService {
  static url = "https://63c09b663e974879a75e4707.mockapi.io/smurfs";

  static getAllSmurfs() {
    return $.get(this.url);
  }

  static getSmurf(id) {
    return $.get(`${this.url}/${id}`);
  }

  static createSmurf(smurf) {
    return $.post(this.url, smurf);
  }

  static updateSmurf(id, name, characteristics) {
    const data = { name, characteristics };
    // console.log("User from update User", data);
    return $.ajax({
      url: `${this.url}/${id}`,
      dataType: "json",
      data: JSON.stringify(data),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteSmurf(id) {
    return $.ajax({
      url: `${this.url}/${id}`,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static smurfs;

  static getAllSmurfs() {
    SmurfService.getAllSmurfs().then((smurfs) => this.render(smurfs));
  }

  static createSmurf(name, characteristics) {
    SmurfService.createSmurf(new Smurf(name, characteristics))
      .then(() => SmurfService.getAllSmurfs())
      .then((smurfs) => this.render(smurfs));
  }

  static updateSmurf(id, name, characteristics) {
    SmurfService.updateSmurf(id, name, characteristics)
      .then(() => SmurfService.getAllSmurfs())
      .then((smurfs) => this.render(smurfs));
  }

  static deleteSmurf(id) {
    SmurfService.deleteSmurf(id).then(() =>
      SmurfService.getAllSmurfs().then((smurfs) => this.render(smurfs))
    );
  }

  static render(smurfs) {
    this.smurfs = smurfs;
    $("#smurfs").empty();
    for (let smurf of smurfs) {
      $("#smurfs").prepend(`
        <div class="col-sm-6 col-lg-4" style="margin-top: 15px; margin-right: 25px">
          <div class="card">
        
            <div class="card-body">
              <h5 class="card-title">${smurf.name}</h5>
              <p class="card-text">${smurf.characteristics}</p>
            </div>
          </div>
         <div class="col-sm">
          <div class="row">
            <div class="col-sm">
              <input
                type="text"
                id="${smurf.id}-update-smurf-name"
                class="form-control"
                placeholder="New Name"
                required
              />
            </div>
            <div class="col-sm">
              <input
                type="text"
                id="${smurf.id}-update-smurf-characteristics"
                class="form-control"
                placeholder="What is Smurf like now??"
                required
              />
            </div>
            <button id="#${smurf.id}-update-smurf" class="btn btn-primary form-control" onclick="updateSmurf('${smurf.id}')">
              Update Smurf
            </button>
            <button
              id="delete-smurf"
              class="btn btn-danger form-control"
              onclick="DOMManager.deleteSmurf('${smurf.id}')"
            >
              Delete Smurf
            </button>
          </div>
        </div>
        </div>
        <br />
        `);
    }
  }
}

//create new smurf
$("#add-new-smurf").click(() => {
  DOMManager.createSmurf(
    $("#new-smurf-name").val(),
    $("#new-smurf-characteristics").val()
  );
  $("#new-smurf-name").val("");
  $("#new-smurf-characteristics").val("");
});

//update smurf
function updateSmurf(id) {
  const name = $(`#${id}-update-smurf-name`).val();
  const characteristics = $(`#${id}-update-smurf-characteristics`).val();
  // console.log({
  //   id,
  //   name,
  //   characteristics,
  // });

  DOMManager.updateSmurf(id, name, characteristics);
  $(`#${id}-update-smurf`).val("");
}

//display all existing smurfs on first render
DOMManager.getAllSmurfs();
