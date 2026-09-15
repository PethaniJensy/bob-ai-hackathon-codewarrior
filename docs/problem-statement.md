# Problem Statement

## Background

Cold-chain logistics moves temperature-sensitive cargo — vaccines, blood plasma, insulin,
frozen and fresh food — across hundreds of miles of road freight, often through regions
exposed to severe weather. A single refrigerated trailer failure, route closure, or
prolonged idle period can push cargo outside its safe temperature band long before it
reaches its destination.

## The Problem

Operations teams currently rely on periodic manual checks of shipment temperature logs and
separate weather/road-closure feeds. There is no system that continuously cross-references
live IoT temperature telemetry against FDA/WHO Mean Kinetic Temperature (MKT) thresholds
*and* active disruption data (storms, highway closures) in real time. As a result, a
temperature excursion — like the one modeled in our demo, where Shipment SHP-8801
(10,000 pediatric vaccine doses, $520,000) breaches its 8°C safe limit while stuck behind
Winter Storm Boreas' I-80 closure — is often only discovered at delivery, when the cargo
has already spoiled.

## Who is Affected

Cold-chain logistics coordinators and fleet dispatchers at pharmaceutical distributors and
perishable-goods carriers, who are responsible for dozens of simultaneous in-transit
shipments and currently have no single view that combines telemetry, weather, and available
rescue-fleet capacity.

## Why It Matters

A single spoiled shipment of pharmaceuticals can mean a direct loss in the hundreds of
thousands of dollars (as in our SHP-8801 scenario), regulatory reporting obligations, and,
for vaccines specifically, a real public-health cost if replacement doses can't be sourced
in time. Idle refrigerated fleet assets sitting unused at nearby depots (like REEFER-WY-04,
14.2 miles from the breach) represent a rescue opportunity that's invisible without
real-time cross-referencing.

## Why Existing Solutions Fall Short

Most fleet management tools show either temperature telemetry *or* GPS/routing — rarely
both, and almost never combined with an automated decision layer that can recommend (or
execute) a rescue. Even when breaches are flagged, someone still has to manually check
which idle assets are nearby and manually coordinate the reroute — by which point the
temperature has often already crossed into unrecoverable territory.