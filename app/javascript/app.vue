<template>
  <draggable v-model="lists" :options="{ group: 'lists' }" class="board dragArea" @end="listMoved">
    <list v-bind:key="(list, index)" v-for="(list, index) in lists" :list="list" />

    <div class="list">
      <a v-if="!editing" v-on:click="startEditing">Add a List</a>
      <textarea
        v-if="editing"
        ref="message"
        v-model="message"
        class="form-control mb-1"
        @keyup.enter="createList"
        @keyup.escape="editing = false"
      ></textarea>
      <button v-if="editing" v-on:click="createList" class="btn btn-secondary">Add</button>
      <a v-if="editing" v-on:click="editing = false">Cancel</a>
    </div>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
import list from "./components/list";
export default {
  components: { draggable, list },
  data: function() {
    return {
      editing: false,
      message: ""
    };
  },
  computed: {
    lists: {
      get() {
        return this.$store.state.lists;
      },
      set(value) {
        this.$store.state.lists = value;
      }
    }
  },
  methods: {
    startEditing: function() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.message.focus();
      });
    },
    listMoved: function(event) {
      var data = new FormData();
      data.append("list[position]", event.newIndex + 1);

      Rails.ajax({
        url: `/lists/${this.lists[event.newIndex].id}/move`,
        type: "PATCH",
        data: data,
        dataType: "json"
      });
    },
    createList: function() {
      var data = new FormData();
      data.append("list[name]", this.message);

      Rails.ajax({
        url: "/lists",
        type: "POST",
        data: data,
        dataType: "json",
        success: data => {
          this.$store.commit("addList", data);
          this.message = "";
          this.editing = false;
        }
      });
    }
    // New method here
  }
};
</script>

<style scoped>
.dragArea {
  min-height: 20px;
}

.board {
  white-space: nowrap;
  overflow-x: auto;
  min-height: 500px;
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
