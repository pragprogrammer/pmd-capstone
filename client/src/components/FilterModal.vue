<template>
  <div class="filter-modal">
    <button class="btn btn-secondary" data-toggle="modal" data-target="#filterMenuModal">
      {{searchRadius}}mi | #{{postCategory}}
    </button>
    <div id="filterMenuModal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-secondary">
            <h5 class="modal-title text-white">Filter Posts</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer bg-secondary">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {

    name: "FilterModal",

    props: ['postCategory', 'searchRadius']


  };

</script>
<style>
.filter-modal {
  width: 100%;
}
</style>
