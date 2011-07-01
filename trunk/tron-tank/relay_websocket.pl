#!/usr/bin/env perl

#Alf 20110701 - quick hack to echo script to echo to all except first connection.

use strict;
use warnings;

use FindBin;
use lib "$FindBin::Bin/../lib";

use ReAnimator;

my @all_clients;
my $no_of_clients = 0;

ReAnimator->new(
    on_accept => sub {
        my ($self, $client) = @_;

	$all_clients[$no_of_clients++] = $client;
	#print "no_of_clients = $no_of_clients\n";

        $client->on_message(
            sub {
                my ($client, $message) = @_;

		if ($message ne "starting") {
			print "sending $message\n";

			for (my $i=1; $i<$no_of_clients; $i++) {
                		$all_clients[$i]->send_message($message);
				#print "sending $i: $message\n";
			}
		}
            }
        );
    }
)->listen->start;
