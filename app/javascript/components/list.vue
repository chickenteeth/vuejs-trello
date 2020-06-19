<template>
  <div class="list">
    <span class="d-flex">
      <h5>
        <a @click="editing = true">{{ list.name }}</a>
      </h5>

      <span class="dropdown ml-auto">
        <i
          class="fas fa-ellipsis-h dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        ></i>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item disabled" href="#">Edit Name</a>
          <a @click="remove" class="dropdown-item">Delete List</a>
        </div>
      </span>
    </span>

    <draggable
      v-model="list.cards"
      :options="{ group: 'cards' }"
      class="dragArea"
      @change="cardMoved"
    >
      <card v-for="card in list.cards" :key="card.id" :card="card" :list="list"></card>
    </draggable>

    <a v-if="!editing" v-on:click="startEditing">Add a card</a>
    <textarea
      v-if="editing"
      ref="message"
      v-model="message"
      class="form-control mb-1"
      @keyup.enter="createCard"
      @keyup.escape="editing = false"
    ></textarea>
    <button v-if="editing" v-on:click="createCard" class="btn btn-secondary">Add</button>
    <a v-if="editing" v-on:click="editing = false">Cancel</a>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import card from "components/card";
export default {
  components: { card, draggable },
  props: ["list"],
  data: function() {
    return {
      editing: false,
      message: ""
    };
  },
  methods: {
    startEditing: function() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.message.focus();
      });
    },
    cardMoved: function(event) {
      const evt = event.added || event.moved;
      if (evt == undefined) {
        return;
      }
      const element = evt.element;
      const list_index = window.store.state.lists.findIndex(list => {
        return list.cards.find(card => {
          return card.id === element.id;
        });
      });

      var data = new FormData();
      data.append("card[list_id]", window.store.state.lists[list_index].id);
      data.append("card[position]", evt.newIndex + 1);

      Rails.ajax({
        url: `/cards/${element.id}/move`,
        type: "PATCH",
        data: data,
        dataType: "json"
      });
    },
    createCard: function() {
      var data = new FormData();
      data.append("card[list_id]", this.list.id);
      data.append("card[name]", this.message);

      Rails.ajax({
        url: "/cards",
        type: "POST",
        data: data,
        dataType: "json",
        success: data => {
          this.$store.commit("addCard", data);
          this.message = "";
          this.$nextTick(() => {
            this.$refs.message.focus();
          });
        }
      });
    },
    remove: function() {
      Rails.ajax({
        url: `/lists/${this.list.id}`,
        type: "DELETE",
        success: function() {
          return;
        }
      });
    }
  }
};
</script>

<style scoped>
.dragArea {
  min-height: 10px;
}
</style>
