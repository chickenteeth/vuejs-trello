<template>
  <div class="list">
    <h5>{{ list.name }}</h5>
    <hr />

    <draggable
      v-model="list.cards"
      :options="{ group: 'cards' }"
      class="dragArea"
      @change="cardMoved"
    >
      <div
        v-bind:key="(card, index)"
        v-for="(card, index) in list.cards"
        class="card card-body mb-3"
      >{{ card.name }}</div>
    </draggable>

    <a v-if="!editing" v-on:click="startEditing">Add a card</a>
    <textarea
      v-if="editing"
      v-model="message"
      class="form-control"
      ref="message"
      @keyup.enter="submitMessage"
      @keyup.escape="editing = false"
    ></textarea>
    <button v-if="editing" v-on:click="submitMessage" class="btn btn-secondary">Add</button>
    <a v-if="editing" v-on:click="editing=false">Cancel</a>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: { draggable },
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
      // if (evt.added == undefined) {
      //   return;
      // }
      const element = evt.element;
      const list_index = window.store.lists.findIndex(list => {
        return list.cards.find(card => {
          return card.id === element.id;
        });
      });

      var data = new FormData();
      data.append("card[list_id]", window.store.lists[list_index].id);
      data.append("card[position]", evt.newIndex + 1);

      Rails.ajax({
        url: `/cards/${element.id}/move`,
        type: "PATCH",
        data: data,
        dataType: "json"
      });
    },
    submitMessage: function() {
      var data = new FormData();
      data.append("card[list_id]", this.list.id);
      data.append("card[name]", this.message);

      Rails.ajax({
        url: "/cards",
        type: "POST",
        data: data,
        dataType: "json",
        success: data => {
          const index = window.store.lists.findIndex(
            item => item.id == this.list.id
          );
          window.store.lists[index].cards.push(data);
          this.message = "";
        }
      });
    }
  }
};
</script>

<style scoped>
.dragArea {
  min-height: 20px;
}
.list {
  background: #e2e4e6;
  border-radius: 3px;
  width: 270px;
  margin-right: 20px;
  padding: 10px;
  display: inline-block;
  vertical-align: top;
}
</style>