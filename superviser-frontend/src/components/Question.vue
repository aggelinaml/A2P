<template>
  <li class='question-element'>
    <el-input class='label-input'
      v-model='question.label'
      @change='onModification'
      :disabled='!editable'></el-input>
    <span v-if='editable' class='vertical-toolbar float-right'>
        <i class='el-icon-close round-boxed big'
          @click='deleteQuestion'>
        </i>
        <i class='el-icon-arrow-up round-boxed big'
          @click='moveQuestionUp'>
        </i>
        <i class='el-icon-arrow-down round-boxed big'
          @click='moveQuestionDown'>
        </i>
    </span>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-switch v-model="question.mandatory"
          @change='onModification'
          :disabled='!editable'></el-switch>
      </el-form-item>
      <el-form-item>
        <el-select v-model="question.type" placeholder="Type"
          :disabled='!editable'
          @change='onModification'>
          <el-option
            v-for="option in settings.types"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="question.validator" placeholder="Validator"
          :disabled='!editable'
          @change='onModification'>
          <el-option
            v-for="option in settings.validators"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <ul>
      <aap-choice v-for='(choice, choiceIndex) in question.choices'
        :key='choiceIndex'
        :choice='choice'
        :editable='editable'
        :on-modification='onModification'
        :state-key='{
          processId: stateKey.processId,
          stepIndex: stateKey.stepIndex,
          pageIndex: stateKey.pageIndex,
          questionIndex: stateKey.questionIndex,
          choiceIndex: choiceIndex
          }'/>
      <li v-if='editable' class='choice new-choice'>
        <el-input v-model='newChoice'/>
        <i class='el-icon-plus round-boxed small'
          @click='addNewChoice'></i>
      </li>
    </ul>
  </li>
</template>

<script>

import AapChoice from './Choice.vue';

// TODO handling types in settings.json
export default {
  name: 'aap-question',
  props: ['question', 'settings', 'editable', 'state-key', 'on-modification'],
  data: () => ({
    newChoice: ''
  }),
  components: { AapChoice },
  beforeMount() {
  },
  methods: {
    deleteQuestion() {
      if (!this.editable) return;
      this.$store.commit('REMOVE_QUESTION', this.stateKey);
      this.onModification();
    },
    moveQuestionUp() {
      if (!this.editable) return;
      this.$store.commit('MOVE_QUESTION', {identifier: this.stateKey, up: 1});
      this.onModification();
    },
    moveQuestionDown() {
      if (!this.editable) return;
      this.$store.commit('MOVE_QUESTION', {identifier: this.stateKey, up:-1});
      this.onModification();
    },
    addNewChoice() {
      if (!this.editable) return;
      if (this.newChoice === '') return;
      if (this.question.choices.indexOf(this.newChoice) !== -1) {
        this.$alert(`${this.newChoice} is already a possibility`, 'Invalid choice', {
          confirmButtonText: 'OK'
        });
        return;
      }
      this.$store.commit('ADD_CHOICE', { identifier: this.stateKey, value: this.newChoice });
      this.onModification();
      this.newChoice = '';
    }
  }
}
</script>


<style>
/* TODO: understand how to use the global variable var(--color-primary); for background-color*/
.question-element h4 {
    display: inline-block;
    font-size: 16px;
}

.float-right {
  float: right;
}

.vertical-toolbar i {
  display: block;
}

.disabled i.round-boxed {
  color: #cfd6d9;
  cursor: not-allowed;
}

.label-input {
  width: 600px;
  margin: 10px;
  font-size: larger;
  font-weight: bold;
  padding: 10px;
}

li.choice {
  height: 30px;
  font-size: 13px;
  line-height: 30px;
}

li.new-choice {
  background-color: white;
}

li.new-choice .el-input {
  width: auto;
}

li.new-choice .el-input input {
  height: 29px;
  border: none;
}

li.new-choice .el-input input:focus {
  border: none;
}

li.new-choice {
  border-color: #DCDFE6;
}

li.new-choice:focus-within {
  border-color: teal;
}
</style>
