<script setup lang="ts">
import { useCopy } from '@/composables/useCopy';

const { t } = useCopy();
</script>

<template>
    <section>
        <h2>{{ t('security.checks.intro.title') }}</h2>
        <p>{{ t('security.checks.intro.lead') }}</p>

        <input
            type="text"
            placeholder="Search the audit log"
            aria-label="Search the audit log"
        />

        <button type="button" title="Back to top">
            <span aria-hidden="true">A</span>
        </button>
    </section>
</template>
