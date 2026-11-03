<?php

return [
    'header' => [
        'title' => 'How Ledgerly keeps your ledger.',
        'lead' => 'You are being asked to connect a live accounting system. This page answers a security review, and a reviewer should not have to ask for any of it.',
    ],
    'pillars' => [
        'pipeline' => [
            'title' => 'Every export is checked first',
            'text' => 'Seven checks, in one place, in this order. Fail any of them and nothing leaves your ledger.',
        ],
    ],
    'checks' => [
        'intro' => [
            'title' => 'How an export runs.',
            'lead' => 'Seven checks, in this order, in one place. Fail any of them and the export never leaves your ledger.',
        ],
    ],
    'architecture' => [
        'items' => [
            ['title' => 'PHP 8.2 or newer, on Laravel 11', 'text' => 'Every path to a customer ledger is behind one contract.'],
        ],
    ],
    'log' => [
        'append_title' => 'Append-only, enforced twice over',
    ],
];
