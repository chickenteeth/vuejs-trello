<template>
  <div>
    <div @click="editing = true" class="card card-body mb-3">{{ card.name }}</div>

    <div v-if="editing" class="modal-backdrop show"></div>

    <div v-if="editing" @click="closeModal" class="modal show" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ card.name }}</h5>
          </div>
          <div class="modal-body">
            <input v-model="name" class="form-control" @keyup.enter="save" />
          </div>
          <div class="modal-footer d-flex">
            <a class="mr-auto">Delete card</a>
            <button @click="save" type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import draggable from "vuedraggable";
export default {
  props: ["card", "list"],
  data: function() {
    return {
      editing: false,
      name: this.card.name
    };
  },
  methods: {
    closeModal: function(event) {
      if (event.target.classList.contains("modal")) {
        this.editing = false;
      }
    },
    save: function() {
      var data = new FormData();
      data.append("card[name]", this.name);

      Rails.ajax({
        url: `/cards/${this.card.id}`,
        type: "PATCH",
        data: data,
        dataType: "json",
        success: data => {
          const list_index = window.store.lists.findIndex(
            item => item.id === this.list.id
          );
          const card_index = window.store.lists.findIndex(
            item => item.id === this.card.id
          );
          window.store.lists[list_index].cards.splice(card_index, 1, data);
          this.editing = false;
        }
      });
    }
  }
};
</script>

<style>
</style>