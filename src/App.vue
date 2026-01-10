<template>
    <div :class="`  h-full `">
        <Dialog
            v-model="dialogStore.isOpen"
            :title="''"
            :content="dialogStore.content"
            :bind-properties="dialogStore.bindProperties"
        />
        <RouterView />
    </div>
</template>
<script setup lang="ts">
import Dialog from '@/components/Dialog.vue'
import { useDialog } from './stores/dialog'

const dialogStore = useDialog()
</script>
<style>
@font-face {
    font-family: 'Nunito';
    src: url('@/assets/fonts/Nunito-VariableFont_wght.ttf');
}
@font-face {
    font-family: 'HelveticaNeue';
    src: url('@/assets/fonts/HelveticaNeueBlack.otf');
}
@font-face {
    font-family: 'best-font';
    src: url('@/assets/fonts/Line-Awesome.ttf');
}
@font-face {
    font-family: 'best-font2';
    src: url('@/assets/fonts/Material-Icons.ttf');
}
/* Custom scrollbar styles */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
