#!/usr/bin/env python3
"""
A command-line tool that maps CLI arguments to REST API calls.

Usage examples:
    # Healthcheck (default output: JSON if applicable)
    $ se24XX healthcheck

    # Reset passes
    $ se24XX resetpasses

    # Reset toll stations
    $ se24XX resetstations

    # Login
    $ se24XX login --username myuser --passw mypass

    # Logout (pass token via --token)
    $ se24XX logout --token abcdef12345

    # Get toll station passes (default CSV output if --format not provided)
    $ se24XX tollstationpasses --station NAO01 --from 20241101 --to 20241130

    # Pass analysis between operators (default JSON)
    $ se24XX passanalysis --stationop opA --tagop opB --from 20241101 --to 20241130 --format json

    # Cost of passes between operators
    $ se24XX passescost --stationop opA --tagop opB --from 20241101 --to 20241130

    # Charges by (other operator)
    $ se24XX chargesby --opid opC --from 20241101 --to 20241130

    # Administrative functions – add passes from CSV
    $ se24XX admin --addpasses --source ./newpassesXXXXXX.csv
"""

import argparse
import sys
import openapi_client
from openapi_client.rest import ApiException

def main():
    parser = argparse.ArgumentParser(
        description="CLI tool for accessing the REST API endpoints via openapi_client."
    )
    subparsers = parser.add_subparsers(dest="scope", help="Available scopes")

    # healthcheck
    subparsers.add_parser("healthcheck", help="Check system health (calls /admin/healthcheck)")

    # resetpasses
    subparsers.add_parser("resetpasses", help="Reset passes (calls /admin/resetpasses)")

    # resetstations
    subparsers.add_parser("resetstations", help="Reset toll stations (calls /admin/resetstations)")

    # login
    login_parser = subparsers.add_parser("login", help="Login (calls /login)")
    login_parser.add_argument("--username", required=True, help="Username for login")
    login_parser.add_argument("--passw", required=True, help="Password for login")

    # logout
    logout_parser = subparsers.add_parser("logout", help="Logout (calls /logout)")
    logout_parser.add_argument("--token", required=True, help="Access token (X-OBSERVATORY-AUTH)")

    # tollstationpasses
    tsp_parser = subparsers.add_parser("tollstationpasses", help="Retrieve toll station passes (calls /tollStationPasses)")
    tsp_parser.add_argument("--station", required=True, help="Toll station ID")
    tsp_parser.add_argument("--from", dest="date_from", required=True, help="Start date (YYYYMMDD)")
    tsp_parser.add_argument("--to", dest="date_to", required=True, help="End date (YYYYMMDD)")
    tsp_parser.add_argument("--format", default="csv", help="Output format (csv or json)")

    # passanalysis
    pa_parser = subparsers.add_parser("passanalysis", help="Analyze passes between operators (calls /passAnalysis)")
    pa_parser.add_argument("--stationop", required=True, help="Station operator ID")
    pa_parser.add_argument("--tagop", required=True, help="Tag operator ID")
    pa_parser.add_argument("--from", dest="date_from", required=True, help="Start date (YYYYMMDD)")
    pa_parser.add_argument("--to", dest="date_to", required=True, help="End date (YYYYMMDD)")
    pa_parser.add_argument("--format", default="json", help="Output format (csv or json)")

    # passescost
    pc_parser = subparsers.add_parser("passescost", help="Retrieve cost of passes between operators (calls /passesCost)")
    pc_parser.add_argument("--stationop", required=True, help="Station operator ID")
    pc_parser.add_argument("--tagop", required=True, help="Tag operator ID")
    pc_parser.add_argument("--from", dest="date_from", required=True, help="Start date (YYYYMMDD)")
    pc_parser.add_argument("--to", dest="date_to", required=True, help="End date (YYYYMMDD)")
    pc_parser.add_argument("--format", default="json", help="Output format (csv or json)")

    # chargesby
    cb_parser = subparsers.add_parser("chargesby", help="Retrieve charges by operator (calls /chargesBy)")
    cb_parser.add_argument("--opid", required=True, help="Operator ID")
    cb_parser.add_argument("--from", dest="date_from", required=True, help="Start date (YYYYMMDD)")
    cb_parser.add_argument("--to", dest="date_to", required=True, help="End date (YYYYMMDD)")
    cb_parser.add_argument("--format", default="json", help="Output format (csv or json)")

    # admin functions
    admin_parser = subparsers.add_parser("admin", help="Administrative functions")
    admin_parser.add_argument("--usermod", action="store_true", help="Create/modify a user (requires --username and --passw)")
    admin_parser.add_argument("--users", action="store_true", help="List all users")
    admin_parser.add_argument("--addpasses", action="store_true", help="Add passes from CSV file (requires --source)")
    admin_parser.add_argument("--username", help="Username for admin usermod")
    admin_parser.add_argument("--passw", help="Password for admin usermod")
    admin_parser.add_argument("--source", help="Path to CSV file with new passes")

    args = parser.parse_args()

    # Create the API client configuration.
    configuration = openapi_client.Configuration(host="http://localhost:8000")
    with openapi_client.ApiClient(configuration) as api_client:
        api_instance = openapi_client.DefaultApi(api_client)
        try:
            if args.scope == "healthcheck":
                response = api_instance.admin_healthcheck_get()
                print("Healthcheck response:")
                print(response)
            elif args.scope == "resetpasses":
                response = api_instance.admin_resetpasses_post()
                print("Reset passes response:")
                print(response)
            elif args.scope == "resetstations":
                response = api_instance.admin_resetstations_post()
                print("Reset stations response:")
                print(response)
            elif args.scope == "login":
                response = api_instance.login_post(args.username, args.passw)
                print("Login successful. Response:")
                print(response)
            elif args.scope == "logout":
                # For logout, we need to send the token in the custom header.
                # The API client in these examples takes the token as parameter.
                # In a real client you might want to set a default header:
                api_client.set_default_header("X-OBSERVATORY-AUTH", args.token)
                api_instance.logout_post(args.token)
                print("Logout successful.")
            elif args.scope == "tollstationpasses":
                response = api_instance.toll_station_passes_toll_station_id_date_from_date_to_get(
                    args.station, args.date_from, args.date_to, format=args.format
                )
                print("Toll station passes response:")
                print(response)
            elif args.scope == "passanalysis":
                response = api_instance.pass_analysis_station_op_id_tag_op_id_date_from_date_to_get(
                    args.stationop, args.tagop, args.date_from, args.date_to, format=args.format
                )
                print("Pass analysis response:")
                print(response)
            elif args.scope == "passescost":
                response = api_instance.passes_cost_toll_op_id_tag_op_id_date_from_date_to_get(
                    args.stationop, args.tagop, args.date_from, args.date_to, format=args.format
                )
                print("Passes cost response:")
                print(response)
            elif args.scope == "chargesby":
                response = api_instance.charges_by_toll_op_id_date_from_date_to_get(
                    args.opid, args.date_from, args.date_to, format=args.format
                )
                print("Charges by response:")
                print(response)
            elif args.scope == "admin":
                # Note: The user management endpoints (usermod and users) are marked as optional
                # and are not implemented in the sample API. Only addpasses is shown.
                if args.usermod:
                    if not args.username or not args.passw:
                        print("Error: For --usermod, you must provide --username and --passw")
                        sys.exit(1)
                    # In a complete implementation, here you would call an API endpoint for user creation or password change.
                    print("User modification requested (not implemented in this sample).")
                elif args.users:
                    print("User list requested (not implemented in this sample).")
                elif args.addpasses:
                    if not args.source:
                        print("Error: For --addpasses, you must provide --source with the CSV file path.")
                        sys.exit(1)
                    with open(args.source, "rb") as f:
                        file_bytes = f.read()
                    response = api_instance.admin_addpasses_post(file=file_bytes)
                    print("Admin add passes response:")
                    print(response)
                else:
                    print("No valid admin operation provided.")
            else:
                parser.print_help()
        except ApiException as e:
            print("Exception when calling API:")
            print(e)

if __name__ == "__main__":
    main()
